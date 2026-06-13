package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.entity.User;
import com.sljobbank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;

    // =========================
    // GET ALL USERS (ADMIN)
    // =========================
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.ok(userRepo.findAll())
        );
    }

    // =========================
    // TOGGLE ACTIVE STATUS
    // =========================
    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> toggleActive(@PathVariable String id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(!user.isActive());
        userRepo.save(user);

        return ResponseEntity.ok(
                ApiResponse.ok("User status updated", id)
        );
    }

    // =========================
    // DELETE USER
    // =========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {

        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepo.deleteById(id);

        return ResponseEntity.ok(
                ApiResponse.ok("User deleted", null)
        );
    }
}