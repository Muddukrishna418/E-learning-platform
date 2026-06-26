package com.elearning.repository;

import com.elearning.entity.CourseContent;
import com.elearning.entity.Enrollment;
import com.elearning.entity.EnrollmentContentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnrollmentContentProgressRepository extends JpaRepository<EnrollmentContentProgress, Long> {
    Optional<EnrollmentContentProgress> findByEnrollmentAndContent(Enrollment enrollment, CourseContent content);
}
