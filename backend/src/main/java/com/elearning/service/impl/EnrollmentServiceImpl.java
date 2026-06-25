package com.elearning.service.impl;

import com.elearning.dto.EnrollmentRequest;
import com.elearning.dto.EnrollmentResponse;
import com.elearning.entity.Course;
import com.elearning.entity.Enrollment;
import com.elearning.entity.User;
import com.elearning.exception.ResourceNotFoundException;
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
    private final UserRepository userRepository;

    @Override
    public EnrollmentResponse enroll(EnrollmentRequest request) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = principal instanceof UserDetails userDetails ? userDetails.getUsername() : principal.toString();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = courseRepository.findById(Long.parseLong(request.getCourseId()))
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .build();

        enrollmentRepository.save(enrollment);

        return EnrollmentResponse.builder()
                .message("Enrollment saved successfully")
                .courseId(course.getId())
                .userId(user.getId())
                .build();
    }
}
