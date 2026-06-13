package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.entity.*;
import com.sljobbank.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteRepository favRepo;
    private final UserRepository userRepo;
    private final JobRepository jobRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Favorite>>> getMine(
            @AuthenticationPrincipal UserDetails ud) {

        User user = userRepo.findByEmail(ud.getUsername()).orElseThrow();

        return ResponseEntity.ok(
                ApiResponse.ok(favRepo.findByUserId(user.getId()))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> add(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody Map<String, String> body) {

        User user = userRepo.findByEmail(ud.getUsername()).orElseThrow();
        Job job = jobRepo.findById(body.get("jobId")).orElseThrow();

        if (favRepo.existsByUserIdAndJobId(user.getId(), job.getId())) {
            return ResponseEntity.ok(ApiResponse.err("Already in favorites"));
        }

        Favorite fav = Favorite.builder()
                .user(user)
                .job(job)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(favRepo.save(fav)));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> remove(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable String jobId) {

        User user = userRepo.findByEmail(ud.getUsername()).orElseThrow();

        favRepo.findByUserIdAndJobId(user.getId(), jobId)
                .ifPresent(favRepo::delete);

        return ResponseEntity.ok(ApiResponse.ok("Removed", null));
    }
}