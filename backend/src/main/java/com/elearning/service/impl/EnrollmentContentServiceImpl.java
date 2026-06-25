package com.elearning.service.impl;

import com.elearning.dto.CourseContentResponse;
import com.elearning.entity.Course;
import com.elearning.entity.CourseContent;
import com.elearning.entity.Enrollment;
import com.elearning.entity.User;
import com.elearning.exception.ResourceNotFoundException;
import com.elearning.repository.CourseContentRepository;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.repository.UserRepository;
import com.elearning.service.EnrollmentContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentContentServiceImpl implements EnrollmentContentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseContentRepository contentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    public List<CourseContentResponse> getCourseContent(String courseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = courseRepository.findById(Long.parseLong(courseId))
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Enrollment enrollment = enrollmentRepository.findByUserAndCourse(user, course)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        return contentRepository.findByCourse(course).stream()
                .sorted((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()))
                .map(this::toResponse)
                .toList();
    }

    private CourseContentResponse toResponse(CourseContent content) {
        return CourseContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .type(content.getType())
                .url(content.getUrl())
                .description(content.getDescription())
                .orderIndex(content.getOrderIndex())
                .build();
    }
}
