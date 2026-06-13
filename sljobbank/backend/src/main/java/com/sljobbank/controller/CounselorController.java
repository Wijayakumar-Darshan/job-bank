package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.entity.Job;
import com.sljobbank.entity.CareerCluster;
import com.sljobbank.repository.JobRepository;
import com.sljobbank.repository.CareerClusterRepository;
import com.sljobbank.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/counselor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COUNSELOR')")
public class CounselorController {

    private final JobRepository jobRepository;
    private final CareerClusterRepository clusterRepository;
    private final AnalyticsService analyticsService;

    // ====================== DASHBOARD ======================
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(Authentication auth) {
        long totalJobs = jobRepository.count();
        long totalClusters = clusterRepository.count();

        Map<String, Object> data = Map.of(
                "totalJobs", totalJobs,
                "totalClusters", totalClusters,
                "recentJobs", jobRepository.findTop10ByOrderByCreatedAtDesc()
        );

        return ResponseEntity.ok(new ApiResponse<>(true, "Counselor dashboard loaded", data));
    }

    // ====================== MANAGE JOBS ======================
    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<Job>>> getAllJobs() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Jobs fetched", jobRepository.findAll()));
    }

    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<Job>> createJob(@RequestBody Job job) {
        Job saved = jobRepository.save(job);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job created successfully", saved));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Job>> updateJob(@PathVariable String id, @RequestBody Job job) {
        job.setId(id);
        Job updated = jobRepository.save(job);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job updated", updated));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable String id) {
        jobRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job deleted successfully", null));
    }

    // ====================== ANALYTICS ======================
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Analytics data", analyticsService.getDashboard()));
    }

    // ====================== REPORTS ======================
    @GetMapping("/reports/{type}")
    public ResponseEntity<byte[]> generateReport(@PathVariable String type) {
        // You can expand this with your ReportService
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=report.pdf")
                .body(new byte[0]); // Placeholder
    }
}