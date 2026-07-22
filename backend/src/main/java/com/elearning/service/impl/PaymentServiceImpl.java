package com.elearning.service.impl;

import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;
import com.elearning.entity.Course;
import com.elearning.entity.Enrollment;
import com.elearning.entity.Payment;
import com.elearning.entity.User;
import com.elearning.exception.ApiException;
import com.elearning.exception.ResourceNotFoundException;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.repository.PaymentRepository;
import com.elearning.repository.UserRepository;
import com.elearning.service.EmailService;
import com.elearning.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${payu.merchant-key:test-payu-key}")
    private String payuMerchantKey;

    @Value("${payu.merchant-salt:test-payu-salt}")
    private String payuMerchantSalt;

    @Value("${payu.base-url:https://test.payu.in/_payment}")
    private String payuBaseUrl;

    @Value("${payu.success-url:http://localhost:8082/api/v1/payments/payu/success}")
    private String payuSuccessUrl;

    @Value("${payu.failure-url:http://localhost:8082/api/v1/payments/payu/failure}")
    private String payuFailureUrl;

    @Value("${payu.currency:INR}")
    private String payuCurrency = "INR";

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Override
    public PaymentPurchaseResponse purchaseCourse(PaymentIntentRequest request) {
        User user = resolveCurrentUser();
        Long courseId = parseCourseId(request.getCourseId());

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (course.getPrice() == null || course.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("This course is free and does not require payment.");
        }

        if (paymentRepository.existsByUserAndCourse(user, course) || enrollmentRepository.findByUserAndCourse(user, course).isPresent()) {
            throw new ApiException("You have already purchased this course.");
        }

        String normalizedPaymentMethod = normalizePaymentMethodType(request.getPaymentMethodType());
        if (request.getPaymentMethodId() == null || request.getPaymentMethodId().isBlank()) {
            request.setPaymentMethodId("payu_test_mode_payment");
        }

        String transactionId = "PAYU_" + user.getId() + "_" + course.getId() + "_" + System.currentTimeMillis();
        String amount = course.getPrice().setScale(2, RoundingMode.HALF_UP).toPlainString();
        String productInfo = "Course:" + course.getId();

        Payment payment = Payment.builder()
                .course(course)
                .user(user)
                .amount(course.getPrice())
                .currency(payuCurrency.toUpperCase(Locale.ROOT))
                .paymentMethod(normalizedPaymentMethod)
                .paymentStatus("PENDING")
                .transactionId(transactionId)
                .paymentDate(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        Map<String, String> formData = buildPayuFormData(transactionId, amount, productInfo, user, course);

        return PaymentPurchaseResponse.builder()
                .paymentIntentId(transactionId)
                .clientSecret(null)
                .redirectUrl(payuBaseUrl)
                .paymentStatus("PENDING")
                .transactionId(transactionId)
                .message("Redirecting to PayU for secure payment.")
                .courseId(course.getId().toString())
                .userId(user.getId())
                .enrolled(false)
                .payuFormData(formData)
                .build();
    }

    @Override
    @Transactional
    public PaymentPurchaseResponse handlePayuCallback(String transactionId, String status, String amount, String productInfo,
                                                     String email, String firstName, String hash) {
        if (transactionId == null || transactionId.isBlank()) {
            return PaymentPurchaseResponse.builder().message("Invalid transaction reference.").enrolled(false).build();
        }

        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElse(null);
        if (payment == null) {
            return PaymentPurchaseResponse.builder().message("Payment record not found.").enrolled(false).build();
        }

        User user = payment.getUser();
        Course course = payment.getCourse();
        if (user == null || course == null) {
            return PaymentPurchaseResponse.builder()
                    .paymentStatus("FAILED")
                    .transactionId(transactionId)
                    .message("Payment record is incomplete.")
                    .enrolled(false)
                    .build();
        }

        boolean success = "success".equalsIgnoreCase(status)
                && hash != null
                && !hash.isBlank();

        payment.setPaymentStatus(success ? "SUCCESS" : "FAILED");
        payment.setAmount(new BigDecimal(amount == null || amount.isBlank() ? payment.getAmount().toPlainString() : amount));
        paymentRepository.save(payment);

        if (!success) {
            return PaymentPurchaseResponse.builder()
                    .paymentStatus("FAILED")
                    .transactionId(transactionId)
                    .message("Payment was not completed successfully.")
                    .courseId(course.getId().toString())
                    .userId(user.getId())
                    .enrolled(false)
                    .build();
        }

        if (paymentRepository.existsByUserAndCourse(user, course) || enrollmentRepository.findByUserAndCourse(user, course).isPresent()) {
            return PaymentPurchaseResponse.builder()
                    .paymentStatus("SUCCESS")
                    .transactionId(transactionId)
                    .message("Enrollment already exists.")
                    .courseId(course.getId().toString())
                    .userId(user.getId())
                    .enrolled(true)
                    .build();
        }

        Enrollment enrollment = Enrollment.builder().user(user).course(course).build();
        enrollmentRepository.save(enrollment);

        try {
            emailService.sendEnrollmentConfirmation(user, course);
        } catch (Exception ignored) {
        }

        return PaymentPurchaseResponse.builder()
                .paymentStatus("SUCCESS")
                .transactionId(transactionId)
                .message("Payment completed successfully and your enrollment is now active.")
                .courseId(course.getId().toString())
                .userId(user.getId())
                .enrolled(true)
                .build();
    }

    private Map<String, String> buildPayuFormData(String transactionId, String amount, String productInfo, User user, Course course) {
        Map<String, String> formData = new LinkedHashMap<>();
        formData.put("key", payuMerchantKey);
        formData.put("txnid", transactionId);
        formData.put("amount", amount);
        formData.put("productinfo", productInfo);
        formData.put("firstname", user.getFullName() == null || user.getFullName().isBlank() ? user.getEmail() : user.getFullName());
        formData.put("email", user.getEmail());
        formData.put("phone", "9999999999");
        formData.put("surl", payuSuccessUrl);
        formData.put("furl", payuFailureUrl);
        formData.put("service_provider", "payu_paisa");
        formData.put("curl", frontendUrl + "/courses");
        formData.put("hash", generateHash(transactionId, amount, productInfo, user.getEmail()));
        return formData;
    }

    private String generateHash(String transactionId, String amount, String productInfo, String email) {
        String payload = payuMerchantKey + "|" + transactionId + "|" + amount + "|" + productInfo + "|" + (email == null ? "" : email) + "|||||||||||" + payuMerchantSalt;
        return sha512(payload);
    }

    private String sha512(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            byte[] bytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : bytes) {
                hex.append(String.format(Locale.ROOT, "%02x", b));
            }
            return hex.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    private User resolveCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = principal instanceof UserDetails userDetails ? userDetails.getUsername() : principal.toString();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Long parseCourseId(String courseId) {
        try {
            return Long.parseLong(courseId);
        } catch (NumberFormatException ex) {
            throw new ApiException("courseId must be a valid numeric value");
        }
    }

    private String normalizePaymentMethodType(String paymentMethodType) {
        if (Objects.isNull(paymentMethodType) || paymentMethodType.isBlank()) {
            return "card";
        }

        return switch (paymentMethodType.trim().toLowerCase(Locale.ROOT)) {
            case "debit_card", "debit-card" -> "debit_card";
            case "upi", "upi_payment" -> "upi";
            case "net_banking", "netbanking", "net-banking" -> "netbanking";
            case "google_pay", "googlepay", "google-pay" -> "google_pay";
            case "wallet" -> "wallet";
            default -> "card";
        };
    }
}
