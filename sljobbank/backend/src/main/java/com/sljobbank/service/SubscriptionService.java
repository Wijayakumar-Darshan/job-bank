package com.sljobbank.service;

import com.sljobbank.entity.*;
import com.sljobbank.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final UserRepository userRepo;
    private final PaymentRepository paymentRepo;
    private final SystemSettingRepository settingRepo;

    @Transactional
    public Map<String, Object> initiatePayment(String userId, String plan) {
        // Fetch user
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch settings (pricing)
        SystemSetting setting = settingRepo.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("System settings not configured"));

        double amount = "yearly".equalsIgnoreCase(plan) ?
                setting.getYearlyPrice() : setting.getMonthlyPrice();

        // Create pending payment
        Payment payment = Payment.builder()
                .user(user)
                .amount(amount)
                .status("PENDING")
                .method("PayHere")
                .reference("SUB-" + System.currentTimeMillis())
                .build();

        payment = paymentRepo.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("paymentId", payment.getId());
        response.put("amount", amount);
        response.put("currency", "LKR");
        response.put("plan", plan);
        response.put("userId", userId);

        return response;
    }

    @Transactional
    public void toggleSubscription(String userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getSubscriptionType() == SubscriptionType.PAID) {
            user.setSubscriptionType(SubscriptionType.FREE);
            user.setSubscriptionExpiryDate(null);
        } else {
            user.setSubscriptionType(SubscriptionType.PAID);
            user.setSubscriptionExpiryDate(LocalDateTime.now().plusYears(1));
        }

        userRepo.save(user);
    }

    @Transactional
    public void activateSubscription(String userId, String paymentId) {
        paymentRepo.findById(paymentId).ifPresent(p -> {
            p.setStatus("COMPLETED");
            p.setPaymentDate(LocalDateTime.now());
            paymentRepo.save(p);
        });

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setSubscriptionType(SubscriptionType.PAID);
        user.setSubscriptionExpiryDate(LocalDateTime.now().plusYears(1));
        userRepo.save(user);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSubscriptionStatus(String userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> status = new HashMap<>();

        status.put("userId", user.getId());
        status.put("subscriptionType", user.getSubscriptionType());
        status.put("expiryDate", user.getSubscriptionExpiryDate());

        boolean active =
                user.getSubscriptionType() == SubscriptionType.PAID
                        && user.getSubscriptionExpiryDate() != null
                        && user.getSubscriptionExpiryDate().isAfter(LocalDateTime.now());

        status.put("active", active);

        return status;
    }
}