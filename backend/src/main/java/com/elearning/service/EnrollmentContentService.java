package com.elearning.service;

import com.elearning.dto.CourseContentResponse;

import java.util.List;

public interface EnrollmentContentService {
    List<CourseContentResponse> getCourseContent(String courseId, String email);

    CourseContentResponse getContentById(String courseId, String contentId, String email);

    CourseContentResponse markContentAsCompleted(String courseId, String contentId, String email);
}
