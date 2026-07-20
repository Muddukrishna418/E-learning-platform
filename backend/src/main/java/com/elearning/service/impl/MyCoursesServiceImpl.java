package com.elearning.service.impl;

import com.elearning.dto.MyCourseEnrollmentResponse;
import com.elearning.entity.Course;
import com.elearning.entity.CourseContent;
import com.elearning.entity.Enrollment;
import com.elearning.entity.User;
import com.elearning.repository.CourseContentRepository;
import com.elearning.repository.EnrollmentContentProgressRepository;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.repository.UserRepository;
import com.elearning.service.MyCoursesService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyCoursesServiceImpl implements MyCoursesService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseContentRepository courseContentRepository;
    private final EnrollmentContentProgressRepository progressRepository;

    @Override
    public List<MyCourseEnrollmentResponse> getMyEnrolledCourses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new IllegalArgumentException("User is not authenticated");
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            Object principal = authentication.getPrincipal();
            email = principal instanceof UserDetails userDetails ? userDetails.getUsername() : principal.toString();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return enrollmentRepository.findByUser(user).stream()
                .map(this::toMyCourseResponse)
                .toList();
    }

    private MyCourseEnrollmentResponse toMyCourseResponse(Enrollment enrollment) {
        Course course = enrollment.getCourse();
        List<CourseContent> contents = courseContentRepository.findByCourse(course);
        long totalContents = contents.size();
        long completedContents = contents.stream()
                .filter(content -> progressRepository.findByEnrollmentAndContent(enrollment, content).isPresent())
                .count();

        int progressPercentage = totalContents == 0 ? 0 : (int) Math.round((completedContents * 100.0) / totalContents);

        return MyCourseEnrollmentResponse.builder()
                .courseId(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .instructorName(course.getInstructor() != null ? course.getInstructor().getFullName() : "Unknown Instructor")
                .category(course.getTitle())
                .progressPercentage(progressPercentage)
                .enrollmentDate(enrollment.getEnrolledAt())
                .build();
    }
}
