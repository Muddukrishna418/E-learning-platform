package com.elearning.service.impl;

import com.elearning.dto.EnrollmentRequest;
import com.elearning.dto.EnrollmentResponse;
import com.elearning.entity.Course;
import com.elearning.entity.Enrollment;
import com.elearning.entity.User;
import com.elearning.exception.ResourceNotFoundException;
import com.elearning.entity.CourseContent;
import com.elearning.repository.CourseContentRepository;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.repository.UserRepository;
import com.elearning.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final CourseContentRepository contentRepository;
    private final UserRepository userRepository;

    @Override
    public EnrollmentResponse enroll(EnrollmentRequest request) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = principal instanceof UserDetails userDetails ? userDetails.getUsername() : principal.toString();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = courseRepository.findById(Long.parseLong(request.getCourseId()))
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

                Enrollment enrollment;
                var existing = enrollmentRepository.findByUserAndCourse(user, course);
                if (existing.isPresent()) {
                        enrollment = existing.get();
                        if (!enrollment.isActive()) {
                                enrollment.setActive(true);
                                enrollment = enrollmentRepository.save(enrollment);
                        }
                } else {
                        enrollment = Enrollment.builder()
                                        .user(user)
                                        .course(course)
                                        .active(true)
                                        .build();
                        enrollment = enrollmentRepository.save(enrollment);
                }

        Long firstContentId = contentRepository.findByCourse(course).stream()
                .min((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()))
                .map(CourseContent::getId)
                .orElse(null);

        String message = (existing.isEmpty()) || (existing.isPresent() && !existing.get().isActive()) ? "Enrollment saved successfully" : "Enrollment already exists";

        return EnrollmentResponse.builder()
                .message(message)
                .courseId(course.getId())
                .userId(user.getId())
                .firstContentId(firstContentId)
                .build();
    }
}
