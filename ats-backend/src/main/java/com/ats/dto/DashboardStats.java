package com.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalJobs;
    private long totalApplications;
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> recentApplicationsByJob;
}
