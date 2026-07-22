package com.elearning.controller;

import com.elearning.dto.PaymentIntentRequest;
import com.elearning.dto.PaymentPurchaseResponse;
import com.elearning.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @PostMapping("/purchase")
    public ResponseEntity<PaymentPurchaseResponse> purchaseCourse(@Valid @RequestBody PaymentIntentRequest request) {
        return ResponseEntity.ok(paymentService.purchaseCourse(request));
    }

    @RequestMapping(value = "/payu/success", method = {RequestMethod.GET, RequestMethod.POST})
    public RedirectView handlePayuSuccess(@RequestParam Map<String, String> params) {
        PaymentPurchaseResponse response = paymentService.handlePayuCallback(
                params.get("txnid"),
                params.get("status"),
                params.get("amount"),
                params.getOrDefault("productinfo", ""),
                params.getOrDefault("email", ""),
                params.getOrDefault("firstname", ""),
                params.getOrDefault("hash", "")
        );

        String redirectPath = response.isEnrolled() ? "/my-courses?payment=success" : "/courses?payment=failed";
        return new RedirectView(frontendUrl + redirectPath);
    }

    @RequestMapping(value = "/payu/failure", method = {RequestMethod.GET, RequestMethod.POST})
    public RedirectView handlePayuFailure(@RequestParam Map<String, String> params) {
        PaymentPurchaseResponse response = paymentService.handlePayuCallback(
                params.get("txnid"),
                params.get("status"),
                params.get("amount"),
                params.getOrDefault("productinfo", ""),
                params.getOrDefault("email", ""),
                params.getOrDefault("firstname", ""),
                params.getOrDefault("hash", "")
        );

        String redirectPath = response.isEnrolled() ? "/my-courses?payment=success" : "/courses?payment=failed";
        return new RedirectView(frontendUrl + redirectPath);
    }
}
