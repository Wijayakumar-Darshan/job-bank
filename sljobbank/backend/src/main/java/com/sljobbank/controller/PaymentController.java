package com.sljobbank.controller;

import com.sljobbank.dto.response.ApiResponse;
import com.sljobbank.entity.Payment;
import com.sljobbank.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepo;

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<Payment>>> getAll() {
        List<Payment> payments = paymentRepo.findAll();
        return ResponseEntity.ok(ApiResponse.ok(payments));
    }
}