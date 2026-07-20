package com.elearning.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CourseRequest {
    @NotBlank
    private String title;

    private String description;
    private String thumbnailUrl;
    private String duration;
    private String level;
    private BigDecimal price;
    private boolean published;
    private boolean featured;
    private Long categoryId;
}
