package com.ats.service;

import com.ats.dto.ApplicationDto;
import com.ats.dto.DashboardStats;
import com.ats.model.Application;
import com.ats.model.Application.ApplicationStatus;
import com.ats.model.Job;
import com.ats.repository.ApplicationRepository;
import com.ats.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final FileStorageService fileStorageService;

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByFilters(Long jobId, ApplicationStatus status) {
        return applicationRepository.findByFilters(jobId, status)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> searchApplications(String query) {
        return applicationRepository.searchByNameOrEmail(query)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return toDto(application);
    }

    @Transactional
    public ApplicationDto submitApplication(Long jobId, String candidateName,
            String candidateEmail, MultipartFile resume) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getActive()) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        String resumePath = null;
        String resumeOriginalName = null;

        if (resume != null && !resume.isEmpty()) {
            resumePath = fileStorageService.storeFile(resume);
            resumeOriginalName = resume.getOriginalFilename();
        }

        Application application = Application.builder()
                .candidateName(candidateName)
                .candidateEmail(candidateEmail)
                .resumePath(resumePath)
                .resumeOriginalName(resumeOriginalName)
                .job(job)
                .build();

        Application saved = applicationRepository.save(application);
        return toDto(saved);
    }

    @Transactional
    public ApplicationDto updateStatus(Long id, ApplicationStatus status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        Application saved = applicationRepository.save(application);
        return toDto(saved);
    }

    public DashboardStats getDashboardStats() {
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        Map<String, Long> applicationsByStatus = new LinkedHashMap<>();
        Arrays.stream(ApplicationStatus.values()).forEach(
                status -> applicationsByStatus.put(status.name(), applicationRepository.countByStatus(status)));

        Map<String, Long> recentApplicationsByJob = new LinkedHashMap<>();
        jobRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .limit(5)
                .forEach(job -> recentApplicationsByJob.put(job.getTitle(),
                        applicationRepository.countByJobId(job.getId())));

        return DashboardStats.builder()
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .applicationsByStatus(applicationsByStatus)
                .recentApplicationsByJob(recentApplicationsByJob)
                .build();
    }

    private ApplicationDto toDto(Application application) {
        return ApplicationDto.builder()
                .id(application.getId())
                .candidateName(application.getCandidateName())
                .candidateEmail(application.getCandidateEmail())
                .resumeOriginalName(application.getResumeOriginalName())
                .resumeDownloadUrl(
                        application.getResumePath() != null ? "/api/files/download/" + application.getResumePath()
                                : null)
                .status(application.getStatus())
                .submittedAt(application.getSubmittedAt())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .build();
    }
}
