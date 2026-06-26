package com.elearning.controller;

import com.elearning.dto.CourseContentResponse;
import com.elearning.service.EnrollmentContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
        String email = currentUserEmail();
        return ResponseEntity.ok(enrollmentContentService.getCourseContent(courseId, email));
    }

    @GetMapping("/{courseId}/content/{contentId}")
    public ResponseEntity<CourseContentResponse> getContentById(@PathVariable String courseId, @PathVariable String contentId) {
        String email = currentUserEmail();
        return ResponseEntity.ok(enrollmentContentService.getContentById(courseId, contentId, email));
    }

    @PostMapping("/{courseId}/content/{contentId}/complete")
    public ResponseEntity<CourseContentResponse> completeContent(@PathVariable String courseId, @PathVariable String contentId) {
        String email = currentUserEmail();
        return ResponseEntity.ok(enrollmentContentService.markContentAsCompleted(courseId, contentId, email));
    }

    private String currentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "student@example.com";
        }
        return authentication.getName();
    }
}
