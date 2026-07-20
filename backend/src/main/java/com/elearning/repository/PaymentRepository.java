package com.elearning.repository;

import com.elearning.entity.Course;
import com.elearning.entity.Payment;
import com.elearning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByUserAndCourse(User user, Course course);
}
