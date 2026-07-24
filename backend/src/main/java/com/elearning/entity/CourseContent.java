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

    @Column(name = "video_id", length = 32)
    private String videoId;

    @Column(nullable = false)
    private String url;

    private String description;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String contentBody;

    @Column(columnDefinition = "TEXT")
    private String learningObjectives;

    @Column(columnDefinition = "TEXT")
    private String keyTakeaways;

    @Column(columnDefinition = "TEXT")
    private String studyTips;

    @Column(columnDefinition = "TEXT")
    private String resources;

    private String estimatedDuration;

    private String difficulty;

    @Column(nullable = false)
    private Integer orderIndex;
}
