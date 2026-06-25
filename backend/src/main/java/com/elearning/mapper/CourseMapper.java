package com.elearning.mapper;

import com.elearning.dto.CourseResponse;
import com.elearning.entity.Course;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {
    public CourseResponse toResponse(Course course) {
        if (course == null) {
            return null;
        }

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .duration(course.getDuration())
                .level(course.getLevel())
                .price(course.getPrice())
                .published(course.isPublished())
                .featured(course.isFeatured())
                .averageRating(course.getAverageRating())
                .totalStudents(course.getTotalStudents())
                .instructorId(course.getInstructor() != null ? course.getInstructor().getId() : null)
                .instructorName(course.getInstructor() != null ? course.getInstructor().getFullName() : null)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
