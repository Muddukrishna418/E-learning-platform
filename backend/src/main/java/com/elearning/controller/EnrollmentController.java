package com.elearning.controller;

import com.elearning.dto.EnrollmentRequest;
import com.elearning.dto.EnrollmentResponse;
import com.elearning.dto.MyCourseEnrollmentResponse;
import com.elearning.service.EnrollmentService;
import com.elearning.service.MyCoursesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final MyCoursesService myCoursesService;

    @PostMapping
    public ResponseEntity<EnrollmentResponse> enroll(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.enroll(request));
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<MyCourseEnrollmentResponse>> getMyCourses() {
        return ResponseEntity.ok(myCoursesService.getMyEnrolledCourses());
    }
}
