package com.elearning.service.impl;

import com.elearning.dto.CourseContentResponse;
import com.elearning.entity.Course;
import com.elearning.entity.CourseContent;
import com.elearning.entity.Enrollment;
import com.elearning.entity.EnrollmentContentProgress;
import com.elearning.entity.User;
import com.elearning.exception.ResourceNotFoundException;
import com.elearning.repository.CourseContentRepository;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.EnrollmentContentProgressRepository;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.repository.UserRepository;
import com.elearning.service.EnrollmentContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EnrollmentContentServiceImpl implements EnrollmentContentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseContentRepository contentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentContentProgressRepository progressRepository;

    @Override
    public List<CourseContentResponse> getCourseContent(String courseId, String email) {
        Enrollment enrollment = resolveEnrollment(courseId, email);

        return contentRepository.findByCourse(enrollment.getCourse()).stream()
                .sorted((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()))
                .map(content -> toResponse(content, enrollment))
                .toList();
    }

    @Override
    public CourseContentResponse getContentById(String courseId, String contentId, String email) {
        Enrollment enrollment = resolveEnrollment(courseId, email);
        CourseContent content = contentRepository.findById(Long.parseLong(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        if (!content.getCourse().getId().equals(enrollment.getCourse().getId())) {
            throw new ResourceNotFoundException("Content does not belong to the course");
        }

        return toResponse(content, enrollment);
    }

    @Override
    @Transactional
    public CourseContentResponse markContentAsCompleted(String courseId, String contentId, String email) {
        Enrollment enrollment = resolveEnrollment(courseId, email);
        CourseContent content = contentRepository.findById(Long.parseLong(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        if (!content.getCourse().getId().equals(enrollment.getCourse().getId())) {
            throw new ResourceNotFoundException("Content does not belong to the course");
        }

        progressRepository.findByEnrollmentAndContent(enrollment, content).orElseGet(() -> {
            EnrollmentContentProgress progress = EnrollmentContentProgress.builder()
                    .enrollment(enrollment)
                    .content(content)
                    .build();
            return progressRepository.save(progress);
        });

        return toResponse(content, enrollment);
    }

    private Enrollment resolveEnrollment(String courseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = courseRepository.findById(Long.parseLong(courseId))
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        return enrollmentRepository.findByUserAndCourse(user, course)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
    }

    private CourseContentResponse toResponse(CourseContent content, Enrollment enrollment) {
        boolean completed = progressRepository.findByEnrollmentAndContent(enrollment, content).isPresent();
        return CourseContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .type(content.getType())
                .videoId(content.getVideoId())
                .url(content.getUrl())
                .description(content.getDescription())
                .summary(content.getSummary())
                .contentBody(content.getContentBody())
                .learningObjectives(content.getLearningObjectives())
                .keyTakeaways(content.getKeyTakeaways())
                .studyTips(content.getStudyTips())
                .resources(content.getResources())
                .estimatedDuration(content.getEstimatedDuration())
                .difficulty(content.getDifficulty())
                .orderIndex(content.getOrderIndex())
                .completed(completed)
                .build();
    }
}
