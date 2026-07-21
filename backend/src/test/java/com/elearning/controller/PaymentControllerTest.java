package com.elearning.controller;

import com.elearning.controller.PaymentController;
import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;
import com.elearning.security.JwtService;
import com.elearning.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private JwtService jwtService;

    @Test
    void purchaseCourseShouldReturnPaymentSuccessResponse() throws Exception {
        PaymentPurchaseResponse response = PaymentPurchaseResponse.builder()
                .message("Payment Successful")
                .enrolled(true)
                .build();

        when(paymentService.purchaseCourse(any(PaymentIntentRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/payments/purchase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"1\",\"paymentMethodId\":\"pm_test\",\"paymentMethodType\":\"card\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Payment Successful"))
                .andExpect(jsonPath("$.enrolled").value(true));
    }
}
