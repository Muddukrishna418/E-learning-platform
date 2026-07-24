package com.elearning.config;

import com.elearning.entity.Course;
import com.elearning.entity.CourseContent;
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

        if (courseRepository.count() < 60) {
            User instructor = userRepository.findByEmail("instructor@example.com")
                    .orElseGet(() -> userRepository.save(User.builder()
                            .fullName("Instructor Demo")
                            .email("instructor@example.com")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.INSTRUCTOR)
                            .build()));

            java.util.Set<String> existingTitles = courseRepository.findAll().stream()
                    .map(Course::getTitle)
                    .collect(java.util.stream.Collectors.toSet());

            java.util.List<Course> seededCourses = java.util.stream.IntStream.rangeClosed(1, 60)
                    .mapToObj(index -> {
                        String[] titles = {
                                "Full-Stack Web Development",
                                "Digital Marketing Strategy",
                                "Data Analytics Basics",
                                "UI/UX Design Masterclass",
                                "Cloud Computing Foundations",
                                "Python for Automation",
                                "Java Spring Boot Essentials",
                                "React Native Mobile Apps",
                                "Cybersecurity Basics",
                                "DevOps with Docker and Kubernetes",
                                "Machine Learning Fundamentals",
                                "Natural Language Processing",
                                "Prompt Engineering for AI",
                                "Business Intelligence Dashboards",
                                "Product Management Essentials",
                                "Agile Delivery for Teams",
                                "Leadership and Communication",
                                "Finance for Non-Finance Managers",
                                "Sales Enablement Strategies",
                                "Social Media Growth Tactics",
                                "Content Marketing Mastery",
                                "SEO Foundations",
                                "Graphic Design for Beginners",
                                "Advanced Illustration Techniques",
                                "Photography Basics",
                                "Video Editing with Premiere Pro",
                                "3D Modeling for Beginners",
                                "Game Development with Unity",
                                "Introduction to Blockchain",
                                "Smart Contracts with Solidity",
                                "Data Engineering Pipelines",
                                "SQL for Analysts",
                                "Excel Power User",
                                "Power BI Essentials",
                                "Tableau for Business Users",
                                "Research Methods for Product Teams",
                                "User Experience Research",
                                "Design Systems at Scale",
                                "API Design Best Practices",
                                "Microservices Architecture",
                                "System Design Interviews",
                                "Database Internals",
                                "AWS Cloud Practitioner",
                                "Azure Fundamentals",
                                "Google Cloud Essentials",
                                "Linux for Developers",
                                "Git and GitHub Mastery",
                                "Testing Strategies for Teams",
                                "Accessibility in Web Apps",
                                "Performance Tuning for Frontends",
                                "Backend Engineering Patterns",
                                "Data Privacy and Compliance",
                                "Generative AI for Product Teams",
                                "MLOps Fundamentals",
                                "Computer Vision Essentials",
                                "Big Data with Spark",
                                "R for Data Science",
                                "NoSQL Databases",
                                "SRE Foundations"
                        };
                        String[] descriptions = {
                                "Build modern apps with Angular and Spring Boot",
                                "Master campaigns, SEO, and content planning",
                                "Understand dashboards, metrics, and reporting",
                                "Create polished interfaces and better user experiences",
                                "Learn the fundamentals of cloud platforms and deployment",
                                "Automate repetitive work with Python scripts and tools",
                                "Develop robust backend services with Spring Boot",
                                "Create cross-platform mobile apps with React Native",
                                "Protect systems and data with practical security practices",
                                "Deploy and scale software using container orchestration",
                                "Understand core concepts behind machine learning workflows",
                                "Work with language models and NLP pipelines",
                                "Learn how to craft better prompts for modern AI tools",
                                "Turn raw data into business-friendly dashboards",
                                "Drive product success with practical management skills",
                                "Deliver software in short, high-impact iterations",
                                "Improve team collaboration and leadership habits",
                                "Understand financial concepts that drive business decisions",
                                "Grow revenue with better sales strategies and enablement",
                                "Build stronger online brands across social channels",
                                "Create content that attracts and converts audiences",
                                "Master the basics of SEO and discoverability",
                                "Start creating professional visuals and layouts",
                                "Take design skills to the next level with advanced techniques",
                                "Capture better photos with fundamentals and composition",
                                "Edit cinematic videos with modern production tools",
                                "Create 3D assets and scenes for games or products",
                                "Build engaging interactive experiences in Unity",
                                "Understand blockchain concepts and use cases",
                                "Write and deploy smart contracts with Solidity",
                                "Create reliable data pipelines and ingestion flows",
                                "Use SQL confidently for analysis and reporting",
                                "Level up spreadsheet and workbook productivity",
                                "Design attractive dashboards and reports in Power BI",
                                "Create compelling visual stories with Tableau",
                                "Build evidence-based product decisions with research",
                                "Learn how to discover user needs and pain points",
                                "Create consistent and scalable design systems",
                                "Design APIs that are clear, extensible, and easy to use",
                                "Structure services for resilience and maintainability",
                                "Prepare for technical interviews with strong design answers",
                                "Understand database internals and storage trade-offs",
                                "Prepare for cloud certifications and practical deployment",
                                "Learn Azure core services and architecture patterns",
                                "Understand essential Google Cloud services",
                                "Develop stronger command-line and Linux skills",
                                "Use Git and GitHub effectively in real projects",
                                "Create high-value test plans and automation workflows",
                                "Build accessible interfaces for all users",
                                "Improve frontend performance and runtime efficiency",
                                "Apply proven backend engineering patterns at scale",
                                "Understand privacy, compliance, and responsible data handling",
                                "Use AI tools effectively in product and business workflows",
                                "Operationalize machine learning models in production",
                                "Apply computer vision methods to image problems",
                                "Process large datasets with distributed computing",
                                "Analyze data using the R programming language",
                                "Learn how to work with document and key-value stores",
                                "Build reliable services with SRE practices"
                        };
                        String title = titles[(index - 1) % titles.length];
                        String description = descriptions[(index - 1) % descriptions.length];
                        return Course.builder()
                                .title(title)
                                .description(description)
                                .duration(index % 2 == 0 ? "6 weeks" : "8 weeks")
                                .level(index % 3 == 0 ? "Intermediate" : "Beginner")
                                .price(BigDecimal.valueOf(49 + (index % 10) * 10))
                                .published(true)
                                .featured(index % 3 != 0)
                                .instructor(instructor)
                                .build();
                    })
                    .filter(course -> !existingTitles.contains(course.getTitle()))
                    .toList();

            if (seededCourses.isEmpty()) {
                return;
            }

            java.util.List<Course> savedCourses = courseRepository.saveAll(seededCourses);

            for (int i = 0; i < savedCourses.size(); i++) {
                Course course = savedCourses.get(i);
                courseContentRepository.saveAll(java.util.List.of(
                        CourseContent.builder()
                                .course(course)
                                .title(i == 0 ? "Welcome Introduction" : "Core Concepts")
                                .type("VIDEO")
                                .videoId("dQw4w9WgXcQ")
                                .url("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
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
        }
    }
}
