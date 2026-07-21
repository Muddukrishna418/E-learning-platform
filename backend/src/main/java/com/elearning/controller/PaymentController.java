package com.elearning.controller;

import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;
import com.elearning.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/purchase")
    public ResponseEntity<PaymentPurchaseResponse> purchaseCourse(@Valid @RequestBody PaymentIntentRequest request) {
        return ResponseEntity.ok(paymentService.purchaseCourse(request));
    }
}
