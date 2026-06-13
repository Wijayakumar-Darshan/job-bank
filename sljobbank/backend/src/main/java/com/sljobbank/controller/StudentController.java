package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.entity.CareerCluster;
import com.sljobbank.entity.Job;
import com.sljobbank.entity.User;
import com.sljobbank.repository.CareerClusterRepository;
import com.sljobbank.repository.JobRepository;
import com.sljobbank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final CareerClusterRepository careerClusterRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentDashboard(Authentication authentication) {
        String email = authentication.getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<CareerCluster> clusters = careerClusterRepository.findAll();
        List<Job> jobs = jobRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("studentName", student.getFullName());
        response.put("studentEmail", student.getEmail());
        response.put("subscriptionType", student.getSubscriptionType());
        response.put("careerClusters", clusters);
        response.put("recommendedJobs", jobs.stream().limit(6).toList());
        response.put("totalClusters", clusters.size());
        response.put("totalJobs", jobs.size());

        return ResponseEntity.ok(new ApiResponse<>(true, "Student dashboard loaded successfully", response));
    }

    @GetMapping("/career-clusters")
    public ResponseEntity<ApiResponse<List<CareerCluster>>> getAllCareerClusters() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Career clusters fetched successfully", careerClusterRepository.findAll()));
    }

    @GetMapping("/career-clusters/{clusterId}/jobs")
    public ResponseEntity<ApiResponse<List<Job>>> getJobsByCluster(@PathVariable String clusterId) {
        List<Job> jobs = jobRepository.findByCluster_Id(clusterId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Jobs fetched successfully", jobs));
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<Job>>> getAllJobs() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Jobs fetched successfully", jobRepository.findAll()));
    }
}