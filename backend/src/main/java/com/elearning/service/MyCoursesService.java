package com.elearning.service;

import com.elearning.dto.MyCourseEnrollmentResponse;

import java.util.List;

public interface MyCoursesService {
    List<MyCourseEnrollmentResponse> getMyEnrolledCourses();
}
