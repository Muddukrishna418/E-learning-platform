package com.elearning.config;

import com.elearning.entity.Course;
import com.elearning.entity.CourseContent;
import com.elearning.entity.Role;
import com.elearning.entity.User;
import com.elearning.repository.CourseContentRepository;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CourseRepository courseRepository;
    private final CourseContentRepository courseContentRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("test@example.com")) {
            User user = User.builder()
                    .fullName("Test User")
                    .email("test@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(user);
        }

        if (courseRepository.count() == 0) {
            User instructor = User.builder()
                    .fullName("Instructor Demo")
                    .email("instructor@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.INSTRUCTOR)
                    .build();
            instructor = userRepository.save(instructor);

            Course course = Course.builder()
                    .title("Full-Stack Web Development")
                    .description("Build modern apps with Angular and Spring Boot")
                    .duration("8 weeks")
                    .level("Beginner")
                    .price(BigDecimal.valueOf(99))
                    .published(true)
                    .featured(true)
                    .instructor(instructor)
                    .build();
            course = courseRepository.save(course);

            courseContentRepository.saveAll(java.util.List.of(
                    CourseContent.builder().course(course).title("Welcome Introduction").type("VIDEO").url("https://www.w3schools.com/html/mov_bbb.mp4").description("Course intro").orderIndex(1).build(),
                    CourseContent.builder().course(course).title("Project Setup").type("IMAGE").url("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80").description("Project structure overview").orderIndex(2).build(),
                    CourseContent.builder().course(course).title("Build Your First API").type("VIDEO").url("https://www.w3schools.com/html/movie.mp4").description("Create your first backend endpoint").orderIndex(3).build()
            ));
        }
    }
}
