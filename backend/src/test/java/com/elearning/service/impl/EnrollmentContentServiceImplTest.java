package com.elearning.service.impl;

import com.elearning.dto.CourseContentResponse;
import com.elearning.entity.Course;
import com.elearning.entity.CourseContent;
import com.elearning.entity.Enrollment;
import com.elearning.entity.User;
import com.elearning.repository.CourseContentRepository;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class EnrollmentContentServiceImplTest {

    @Test
    void shouldReturnContentWhenUserIsEnrolled() {
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        CourseRepository courseRepository = Mockito.mock(CourseRepository.class);
        EnrollmentRepository enrollmentRepository = Mockito.mock(EnrollmentRepository.class);
        CourseContentRepository contentRepository = Mockito.mock(CourseContentRepository.class);

        EnrollmentContentServiceImpl service = new EnrollmentContentServiceImpl(
                enrollmentRepository,
                contentRepository,
                courseRepository,
                userRepository
        );

        User user = User.builder().id(1L).email("student@example.com").build();
        Course course = Course.builder().id(7L).build();
        Enrollment enrollment = Enrollment.builder().user(user).course(course).build();
        CourseContent content = CourseContent.builder()
                .course(course)
                .title("Welcome video")
                .type("VIDEO")
                .url("https://example.com/video.mp4")
                .description("Intro lesson")
                .build();

        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(courseRepository.findById(7L)).thenReturn(Optional.of(course));
        when(enrollmentRepository.findByUserAndCourse(user, course)).thenReturn(Optional.of(enrollment));
        when(contentRepository.findByCourse(course)).thenReturn(List.of(content));

        List<CourseContentResponse> result = service.getCourseContent("7", "student@example.com");

        assertEquals(1, result.size());
        assertEquals("Welcome video", result.get(0).getTitle());
        assertEquals("VIDEO", result.get(0).getType());
    }
}
