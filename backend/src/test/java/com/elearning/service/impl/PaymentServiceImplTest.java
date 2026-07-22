package com.elearning.service.impl;

import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;
import com.elearning.entity.Course;
import com.elearning.entity.Payment;
import com.elearning.entity.User;
import com.elearning.exception.ApiException;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.repository.PaymentRepository;
import com.elearning.repository.UserRepository;
import com.elearning.service.EmailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Test
    void shouldRejectDuplicatePurchaseForAlreadyEnrolledCourse() {
        User user = User.builder().id(1L).email("student@example.com").build();
        Course course = Course.builder().id(10L).title("Test Course").price(BigDecimal.valueOf(99)).build();

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("student@example.com", null));

        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(courseRepository.findById(10L)).thenReturn(Optional.of(course));
        when(enrollmentRepository.findByUserAndCourse(user, course)).thenReturn(Optional.of(new com.elearning.entity.Enrollment()));

        PaymentIntentRequest request = new PaymentIntentRequest();
        request.setCourseId("10");

        assertThrows(ApiException.class, () -> paymentService.purchaseCourse(request));
    }

    @Test
    void shouldCompletePurchaseInTestModeWhenGatewayCredentialsAreNotConfigured() {
        User user = User.builder().id(1L).email("student@example.com").build();
        Course course = Course.builder().id(11L).title("Fallback Course").price(BigDecimal.valueOf(99)).build();

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("student@example.com", null));

        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(courseRepository.findById(11L)).thenReturn(Optional.of(course));
        when(paymentRepository.existsByUserAndCourse(user, course)).thenReturn(false);
        when(enrollmentRepository.findByUserAndCourse(user, course)).thenReturn(Optional.empty());

        PaymentIntentRequest request = new PaymentIntentRequest();
        request.setCourseId("11");
        request.setPaymentMethodId("pm_card_visa");
        request.setPaymentMethodType("card");

        PaymentPurchaseResponse response = assertDoesNotThrow(() -> paymentService.purchaseCourse(request));
        assertEquals(false, response.isEnrolled());
        assertEquals("PENDING", response.getPaymentStatus());
    }

    @Test
    void shouldCreateEnrollmentOnlyWhenPayuCallbackIsSuccessful() {
        User user = User.builder().id(2L).email("student2@example.com").build();
        Course course = Course.builder().id(12L).title("PayU Course").price(BigDecimal.valueOf(149)).build();
        Payment payment = Payment.builder()
                .transactionId("PAYU_2_12_1")
                .paymentStatus("PENDING")
                .user(user)
                .course(course)
                .build();

        when(paymentRepository.findByTransactionId("PAYU_2_12_1")).thenReturn(Optional.of(payment));
        when(enrollmentRepository.findByUserAndCourse(user, course)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentPurchaseResponse response = assertDoesNotThrow(() -> paymentService.handlePayuCallback("PAYU_2_12_1", "success", "149.00", "PayU Course", "student2@example.com", "Student", "dummy-hash"));

        assertTrue(response.isEnrolled());
        assertEquals("SUCCESS", payment.getPaymentStatus());
    }

    @Test
    void shouldNotCreateEnrollmentWhenPayuCallbackFails() {
        User user = User.builder().id(3L).email("student3@example.com").build();
        Course course = Course.builder().id(13L).title("Failed PayU Course").price(BigDecimal.valueOf(199)).build();
        Payment payment = Payment.builder()
                .transactionId("PAYU_3_13_1")
                .paymentStatus("PENDING")
                .user(user)
                .course(course)
                .build();

        when(paymentRepository.findByTransactionId("PAYU_3_13_1")).thenReturn(Optional.of(payment));

        PaymentPurchaseResponse response = assertDoesNotThrow(() -> paymentService.handlePayuCallback("PAYU_3_13_1", "failure", "199.00", "Failed PayU Course", "student3@example.com", "Student", "dummy-hash"));

        assertFalse(response.isEnrolled());
        assertEquals("FAILED", payment.getPaymentStatus());
    }
}
