package com.elearning.service;

import com.elearning.dto.EnrollmentRequest;
import com.elearning.dto.EnrollmentResponse;

public interface EnrollmentService {
    EnrollmentResponse enroll(EnrollmentRequest request);
}
