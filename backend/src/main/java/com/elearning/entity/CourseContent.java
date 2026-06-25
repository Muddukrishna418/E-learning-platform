package com.elearning.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String url;

    private String description;

    @Column(nullable = false)
    private Integer orderIndex;
}
