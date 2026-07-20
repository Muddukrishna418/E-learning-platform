package com.elearning.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @PostConstruct
    public void init() {
        System.out.println("Gateway configuration initialized successfully.");
    }
}