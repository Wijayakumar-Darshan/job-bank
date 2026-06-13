package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.entity.SystemSetting;
import com.sljobbank.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {
    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<SystemSetting>> get() {
        return ResponseEntity.ok(ApiResponse.ok(settingsService.get()));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<SystemSetting>> getPublic() {
        return ResponseEntity.ok(ApiResponse.ok(settingsService.get()));
    }

    @PutMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SystemSetting>> update(@RequestBody SystemSetting setting) {
        return ResponseEntity.ok(ApiResponse.ok("Settings updated", settingsService.update(setting)));
    }

    @PatchMapping("/toggle-paid-mode")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SystemSetting>> togglePaidMode() {
        return ResponseEntity.ok(ApiResponse.ok("Mode toggled", settingsService.togglePaidMode()));
    }

    @PatchMapping("/pricing")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SystemSetting>> updatePricing(@RequestBody SystemSetting s) {
        return ResponseEntity.ok(ApiResponse.ok("Pricing updated", settingsService.update(s)));
    }
}
