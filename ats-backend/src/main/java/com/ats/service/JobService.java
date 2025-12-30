package com.ats.service;

import com.ats.dto.JobDto;
import com.ats.model.Job;
import com.ats.model.User;
import com.ats.repository.ApplicationRepository;
import com.ats.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public List<JobDto> getAllActiveJobs() {
        return jobRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<JobDto> getJobsByUser(User user) {
        return jobRepository.findByCreatedByIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return toDto(job);
    }

    @Transactional
    public JobDto createJob(JobDto jobDto, User user) {
        Job job = Job.builder()
                .title(jobDto.getTitle())
                .description(jobDto.getDescription())
                .active(true)
                .createdBy(user)
                .build();

        Job saved = jobRepository.save(job);
        return toDto(saved);
    }

    @Transactional
    public JobDto updateJob(Long id, JobDto jobDto, User user) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        if (jobDto.getActive() != null) {
            job.setActive(jobDto.getActive());
        }

        Job saved = jobRepository.save(job);
        return toDto(saved);
    }

    @Transactional
    public void deleteJob(Long id, User user) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        jobRepository.delete(job);
    }

    private JobDto toDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .active(job.getActive())
                .createdAt(job.getCreatedAt())
                .createdByName(job.getCreatedBy() != null ? job.getCreatedBy().getFullName() : null)
                .applicationCount(applicationRepository.countByJobId(job.getId()))
                .build();
    }
}
