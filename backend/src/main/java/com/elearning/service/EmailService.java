package com.elearning.service;

import com.elearning.entity.Course;
import com.elearning.entity.User;

public interface EmailService {
    void sendEnrollmentConfirmation(User user, Course course);
}
