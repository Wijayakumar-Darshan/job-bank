package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.dto.response.InstituteResponse;
import com.sljobbank.entity.Institute;
import com.sljobbank.service.InstituteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/institutes")
@RequiredArgsConstructor
public class InstituteController {

    private final InstituteService instituteService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<InstituteResponse>>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        return ResponseEntity.ok(
                ApiResponse.ok(instituteService.getAll(q, type, pageable))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstituteResponse>> getById(@PathVariable String id) {

        return ResponseEntity.ok(
                ApiResponse.ok(instituteService.getById(id))
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> create(@RequestBody Institute institute) {

        return ResponseEntity.ok(
                ApiResponse.ok("Created", instituteService.create(institute))
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> update(
            @PathVariable String id,
            @RequestBody Institute institute
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok("Updated", instituteService.update(id, institute))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {

        instituteService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.ok("Deleted", null)
        );
    }
}