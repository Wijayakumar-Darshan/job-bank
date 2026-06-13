package com.sljobbank.service;

import com.sljobbank.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor
public class AnalyticsService {
    private final UserRepository userRepo;
    private final JobRepository  jobRepo;
    private final PaymentRepository paymentRepo;
    private final StudentViewRepository viewRepo;
    private final CareerClusterRepository clusterRepo;

    public Map<String, Object> getDashboard() {
        long totalUsers   = userRepo.count();
        long totalJobs    = jobRepo.count();
        long totalClusters = clusterRepo.count();
        double totalRevenue = paymentRepo.findByStatus("COMPLETED")
            .stream().mapToDouble(p -> p.getAmount()).sum();

        return Map.of(
            "totalUsers",    totalUsers,
            "totalJobs",     totalJobs,
            "totalClusters", totalClusters,
            "totalRevenue",  totalRevenue
        );
    }

    public List<Map<String, Object>> getTopJobs() {
        return jobRepo.findTop10ByOrderByCreatedAtDesc().stream()
            .map(j -> Map.<String,Object>of(
                "id", j.getId(), "title", j.getTitle(),
                "demand", j.getIndustryDemand(),
                "viewCount", viewRepo.countByJobId(j.getId())
            )).toList();
    }
}
