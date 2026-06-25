package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String duration;
    private String level;
    private BigDecimal price;
    private boolean published;
    private boolean featured;
    private Double averageRating;
    private Integer totalStudents;
    private Long instructorId;
    private String instructorName;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
