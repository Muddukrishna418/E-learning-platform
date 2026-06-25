package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseContentResponse {
    private Long id;
    private String title;
    private String type;
    private String url;
    private String description;
    private Integer orderIndex;
}
