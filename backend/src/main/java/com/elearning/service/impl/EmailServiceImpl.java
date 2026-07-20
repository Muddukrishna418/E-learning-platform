package com.elearning.service.impl;

import com.elearning.entity.Course;
import com.elearning.entity.User;
import com.elearning.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendEnrollmentConfirmation(User user, Course course) {
        log.info("Enrollment confirmation email skipped for {} for course {}.",
                user != null ? user.getEmail() : "unknown",
                course != null ? course.getTitle() : "unknown");
    }
}
