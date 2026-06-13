package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/initiate")
    @PreAuthorize("hasAnyRole('STUDENT', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initiatePayment(
            @RequestParam String userId,
            @RequestParam String plan) {

        Map<String, Object> response = subscriptionService.initiatePayment(userId, plan);
        return ResponseEntity.ok(ApiResponse.ok("Payment initiated", response));
    }

    /**
     * Toggle Activate / Deactivate (Main endpoint used by Admin)
     */
    @PatchMapping("/{userId}/toggle")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> toggleSubscription(@PathVariable String userId) {
        subscriptionService.toggleSubscription(userId);
        return ResponseEntity.ok(ApiResponse.ok("Subscription toggled successfully", userId));
    }

    /**
     * Manual Activation (after payment)
     */
    @PatchMapping("/{userId}/activate")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'STUDENT')")
    public ResponseEntity<ApiResponse<String>> activateSubscription(
            @PathVariable String userId,
            @RequestParam String paymentId) {

        subscriptionService.activateSubscription(userId, paymentId);
        return ResponseEntity.ok(ApiResponse.ok("Subscription activated successfully", userId));
    }

    @GetMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubscriptionStatus(@PathVariable String userId) {
        Map<String, Object> status = subscriptionService.getSubscriptionStatus(userId);
        return ResponseEntity.ok(ApiResponse.ok("Subscription status retrieved", status));
    }
}