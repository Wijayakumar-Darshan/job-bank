package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.repository.UserRepository;
import com.sljobbank.repository.JobRepository;
import com.sljobbank.repository.CareerClusterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final UserRepository userRepo;
    private final JobRepository jobRepo;
    private final CareerClusterRepository clusterRepo;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {

        Map<String, Object> data = new HashMap<>();

        data.put("totalUsers", userRepo.count());
        data.put("totalJobs", jobRepo.count());
        data.put("totalClusters", clusterRepo.count());
        data.put("totalRevenue", 0); // replace later

        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/jobs/top")
    public ResponseEntity<ApiResponse<?>> getTopJobs() {

        return ResponseEntity.ok(
                ApiResponse.ok(jobRepo.findAll())
        );
    }
}