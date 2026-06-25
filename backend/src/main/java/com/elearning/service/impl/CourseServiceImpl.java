package com.elearning.service.impl;

import com.elearning.dto.CourseRequest;
import com.elearning.dto.CourseResponse;
import com.elearning.entity.Course;
import com.elearning.entity.User;
import com.elearning.exception.ResourceNotFoundException;
import com.elearning.mapper.CourseMapper;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.UserRepository;
import com.elearning.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .duration(request.getDuration())
                .level(request.getLevel())
                .price(request.getPrice())
                .published(request.isPublished())
                .featured(request.isFeatured())
                .instructor(instructor)
                .build();

        return courseMapper.toResponse(courseRepository.save(course));
    }
}
