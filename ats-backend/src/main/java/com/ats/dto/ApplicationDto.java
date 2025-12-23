package com.ats.dto;

import com.ats.model.Application.ApplicationStatus;
import jakarta.validation.constraints.Email;
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
public class ApplicationDto {

    private Long id;

    @NotBlank(message = "Name is required")
    private String candidateName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String candidateEmail;

    private String resumeOriginalName;

    private String resumeDownloadUrl;

    private ApplicationStatus status;

    private LocalDateTime submittedAt;

    private Long jobId;

    private String jobTitle;
}
