package com.elearning.controller;

import com.elearning.dto.CourseContentResponse;
import com.elearning.service.EnrollmentContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentContentController {
    private final EnrollmentContentService enrollmentContentService;

    @GetMapping("/{courseId}/content")
    public ResponseEntity<List<CourseContentResponse>> getContent(@PathVariable String courseId) {
        String email = "student@example.com";
        return ResponseEntity.ok(enrollmentContentService.getCourseContent(courseId, email));
    }
}
