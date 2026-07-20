package com.elearning.service;

import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;

public interface PaymentService {
    PaymentPurchaseResponse purchaseCourse(PaymentIntentRequest request);
}
