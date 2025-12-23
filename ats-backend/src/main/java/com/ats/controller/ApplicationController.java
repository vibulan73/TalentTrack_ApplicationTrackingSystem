package com.ats.controller;

import com.ats.dto.ApplicationDto;
import com.ats.dto.DashboardStats;
import com.ats.dto.StatusUpdateRequest;
import com.ats.model.Application.ApplicationStatus;
import com.ats.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.getApplicationsByFilters(jobId, status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ApplicationDto>> searchApplications(@RequestParam String query) {
        return ResponseEntity.ok(applicationService.searchApplications(query));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(applicationService.getDashboardStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(id, request.getStatus()));
    }
}
