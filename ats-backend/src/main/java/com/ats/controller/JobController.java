package com.ats.controller;

import com.ats.dto.ApplicationDto;
import com.ats.dto.JobDto;
import com.ats.model.User;
import com.ats.service.ApplicationService;
import com.ats.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllActiveJobs());
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobDto>> getMyJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getJobsByUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(@Valid @RequestBody JobDto jobDto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.createJob(jobDto, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id,
            @Valid @RequestBody JobDto jobDto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDto, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id,
            @AuthenticationPrincipal User user) {
        jobService.deleteJob(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApplicationDto> applyForJob(
            @PathVariable Long id,
            @RequestParam("candidateName") String candidateName,
            @RequestParam("candidateEmail") String candidateEmail,
            @RequestParam(value = "resume", required = false) MultipartFile resume) {
        return ResponseEntity.ok(applicationService.submitApplication(id, candidateName, candidateEmail, resume));
    }
}
