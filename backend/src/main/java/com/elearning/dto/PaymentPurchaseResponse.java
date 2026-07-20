package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentPurchaseResponse {
    private String paymentIntentId;
    private String clientSecret;
    private String redirectUrl;
    private String paymentStatus;
    private String transactionId;
    private String message;
    private String courseId;
    private Long userId;
    private boolean enrolled;
}
