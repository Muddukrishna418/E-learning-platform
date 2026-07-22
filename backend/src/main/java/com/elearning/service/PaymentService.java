package com.elearning.service;

import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;

public interface PaymentService {
    PaymentPurchaseResponse purchaseCourse(PaymentIntentRequest request);

    PaymentPurchaseResponse handlePayuCallback(String transactionId, String status, String amount, String productInfo,
                                               String email, String firstName, String hash);
}
