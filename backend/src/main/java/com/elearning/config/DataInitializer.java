package com.elearning.config;

import com.elearning.entity.Course;
import com.elearning.entity.CourseContent;
import com.elearning.entity.Enrollment;
import com.elearning.entity.Role;
import com.elearning.entity.User;
import com.elearning.repository.CourseContentRepository;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.EnrollmentRepository;
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
    private final EnrollmentRepository enrollmentRepository;

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

            java.util.List<Course> seededCourses = java.util.List.of(
                    Course.builder()
                            .title("Full-Stack Web Development")
                            .description("Build modern apps with Angular and Spring Boot")
                            .duration("8 weeks")
                            .level("Beginner")
                            .price(BigDecimal.valueOf(99))
                            .published(true)
                            .featured(true)
                            .instructor(instructor)
                            .build(),
                    Course.builder()
                            .title("Digital Marketing Strategy")
                            .description("Master campaigns, SEO, and content planning")
                            .duration("6 weeks")
                            .level("Intermediate")
                            .price(BigDecimal.valueOf(79))
                            .published(true)
                            .featured(true)
                            .instructor(instructor)
                            .build(),
                    Course.builder()
                            .title("Data Analytics Basics")
                            .description("Understand dashboards, metrics, and reporting")
                            .duration("5 weeks")
                            .level("Beginner")
                            .price(BigDecimal.valueOf(69))
                            .published(true)
                            .featured(true)
                            .instructor(instructor)
                            .build(),
                    Course.builder()
                            .title("UI/UX Design Masterclass")
                            .description("Create polished interfaces and better user experiences")
                            .duration("7 weeks")
                            .level("Intermediate")
                            .price(BigDecimal.valueOf(89))
                            .published(true)
                            .featured(true)
                            .instructor(instructor)
                            .build()
            );

            java.util.List<Course> savedCourses = courseRepository.saveAll(seededCourses);

            for (int i = 0; i < savedCourses.size(); i++) {
                Course course = savedCourses.get(i);
                courseContentRepository.saveAll(java.util.List.of(
                        CourseContent.builder()
                                .course(course)
                                .title(i == 0 ? "Welcome Introduction" : "Core Concepts")
                                .type("VIDEO")
                                .url("https://www.w3schools.com/html/mov_bbb.mp4")
                                .description("Start with the big picture of the course and understand the learning journey ahead.")
                                .summary("This lesson gives a clear introduction to the course structure and outcomes.")
                                .contentBody("You will learn the big picture, how to study efficiently, and how to make the most of the learning material.")
                                .learningObjectives("Understand the course roadmap\nRecognize the main milestones\nKnow how to study with focus")
                                .keyTakeaways("A clear plan improves retention\nThe first lesson sets the tone for the course")
                                .studyTips("Take short notes while you watch\nPause and summarize each section")
                                .resources("Course roadmap | /courses/1\nStudy checklist | /courses/1")
                                .estimatedDuration("12 min")
                                .difficulty("Beginner")
                                .orderIndex(1)
                                .build(),
                        CourseContent.builder()
                                .course(course)
                                .title("Practice Activity")
                                .type("IMAGE")
                                .url("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80")
                                .description("Exercise what you learned and reinforce the concepts in a practical way.")
                                .summary("This lesson turns theory into practice with hands-on guidance.")
                                .contentBody("You will complete a practical activity that reinforces the lesson and helps you apply the skill confidently.")
                                .learningObjectives("Practice the concepts\nApply the lesson to a real use case\nReflect on what you learned")
                                .keyTakeaways("Practice improves retention\nSmall applications make learning stick")
                                .studyTips("Work through the activity slowly\nReview your notes after each step")
                                .resources("Activity guide | /courses/1")
                                .estimatedDuration("8 min")
                                .difficulty("Beginner")
                                .orderIndex(2)
                                .build()
                ));
            }

            User student = userRepository.findByEmail("test@example.com").orElseThrow();
            for (Course course : savedCourses) {
                if (enrollmentRepository.findByUserAndCourse(student, course).isEmpty()) {
                    enrollmentRepository.save(Enrollment.builder().user(student).course(course).build());
                }
            }
        }
    }
}
