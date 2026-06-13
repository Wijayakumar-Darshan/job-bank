package com.sljobbank.controller;

import com.sljobbank.dto.request.JobRequest;
import com.sljobbank.dto.response.*;
import com.sljobbank.entity.Job;
import com.sljobbank.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String clusterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(jobService.getAll(q, clusterId, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> create(@RequestBody JobRequest request) {

        if (request == null || request.getJob() == null) {
            throw new RuntimeException("Invalid request: job payload is missing");
        }

        String id = jobService.create(
                request.getJob(),
                request.getQualificationIds(),
                request.getClusterId()
        );

        return ResponseEntity.ok(ApiResponse.ok("Job created", id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> update(
            @PathVariable String id,
            @RequestBody JobRequest request
    ) {
        String updated = jobService.update(id, request.getJob(), request.getQualificationIds(), request.getClusterId());
        return ResponseEntity.ok(ApiResponse.ok("Job updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        jobService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}