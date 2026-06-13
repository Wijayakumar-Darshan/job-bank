package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.entity.CareerCluster;
import com.sljobbank.repository.CareerClusterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/clusters")
@RequiredArgsConstructor
public class ClusterController {
    private final CareerClusterRepository clusterRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CareerCluster>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(clusterRepo.findAll()));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<CareerCluster>>> getPublic() {
        return ResponseEntity.ok(ApiResponse.ok(clusterRepo.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CareerCluster>> create(@RequestBody CareerCluster c) {
        return ResponseEntity.ok(ApiResponse.ok("Created", clusterRepo.save(c)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CareerCluster>> update(@PathVariable String id, @RequestBody CareerCluster c) {
        c.setId(id);
        return ResponseEntity.ok(ApiResponse.ok("Updated", clusterRepo.save(c)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        clusterRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
