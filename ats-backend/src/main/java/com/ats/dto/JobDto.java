package com.ats.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {

    private Long id;

    @NotBlank(message = "Job title is required")
    private String title;

    private String description;

    private Boolean active;

    private LocalDateTime createdAt;

    private String createdByName;

    private Long applicationCount;
}
