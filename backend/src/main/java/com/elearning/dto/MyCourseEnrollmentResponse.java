package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyCourseEnrollmentResponse {
    private Long courseId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String instructorName;
    private String category;
    private Integer progressPercentage;
    private LocalDateTime enrollmentDate;
    private Boolean active;
}
