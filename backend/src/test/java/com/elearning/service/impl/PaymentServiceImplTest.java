package com.elearning.service.impl;

import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;
import com.elearning.entity.Course;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
        assertEquals(true, response.isEnrolled());
    }
}
