package com.elearning.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnrollmentRequest {
    @NotBlank
    private String courseId;
}
