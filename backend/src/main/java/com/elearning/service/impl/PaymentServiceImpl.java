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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Locale;
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

    @Value("${easebuzz.merchant-key:test-merchant-key}")
    private String easebuzzMerchantKey;

    @Value("${easebuzz.merchant-salt:test-merchant-salt}")
    private String easebuzzMerchantSalt;

    @Value("${easebuzz.base-url:http://localhost:4202/payment/callback}")
    private String easebuzzBaseUrl;

    @Value("${easebuzz.currency:INR}")
    private String easebuzzCurrency = "INR";

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
            request.setPaymentMethodId("easebuzz_test_mode_payment");
        }

        String transactionId = "EB_" + user.getId() + "_" + course.getId() + "_" + System.currentTimeMillis();
        String amount = course.getPrice().setScale(2, RoundingMode.HALF_UP).toPlainString();
        String redirectUrl = easebuzzBaseUrl + "?courseId=" + course.getId() + "&transactionId=" + URLEncoder.encode(transactionId, StandardCharsets.UTF_8);

        Payment payment = Payment.builder()
                .course(course)
                .user(user)
                .amount(course.getPrice())
                .currency(easebuzzCurrency.toUpperCase(Locale.ROOT))
                .paymentMethod(normalizedPaymentMethod)
                .paymentStatus("SUCCESS")
                .transactionId(transactionId)
                .paymentDate(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);
        enrollmentRepository.save(Enrollment.builder()
                .user(user)
                .course(course)
                .build());

        try {
            emailService.sendEnrollmentConfirmation(user, course);
        } catch (Exception ignored) {
        }

        return PaymentPurchaseResponse.builder()
                .paymentIntentId(transactionId)
                .clientSecret(null)
                .redirectUrl(redirectUrl)
                .paymentStatus("SUCCESS")
                .transactionId(transactionId)
                .message("Payment processed successfully and your enrollment is now active.")
                .courseId(course.getId().toString())
                .userId(user.getId())
                .enrolled(true)
                .build();
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
