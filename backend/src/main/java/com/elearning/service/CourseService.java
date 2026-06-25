package com.elearning.service;

import com.elearning.dto.CourseRequest;
import com.elearning.dto.CourseResponse;

public interface CourseService {
    CourseResponse createCourse(CourseRequest request, Long instructorId);
}
