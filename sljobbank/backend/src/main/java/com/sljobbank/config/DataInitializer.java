package com.sljobbank.config;

import com.sljobbank.entity.*;
import com.sljobbank.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SystemSettingRepository settingRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        initSettings();
        initAdminUser();
    }

    private void initSettings() {
        if (settingRepo.count() == 0) {
            settingRepo.save(SystemSetting.builder()
                .paidModeEnabled(false)
                .monthlyPrice(990.0)
                .yearlyPrice(8900.0)
                .bankName("Bank of Ceylon")
                .accountNumber("7890-1234-5678")
                .accountHolder("SL Job Bank (Pvt) Ltd")
                .build());
            log.info("✅ Default system settings initialised");
        }
    }

    private void initAdminUser() {
        if (!userRepo.existsByEmail("admin@sljobbank.lk")) {
            userRepo.save(User.builder()
                .fullName("Super Admin")
                .email("admin@sljobbank.lk")
                .password(encoder.encode("Admin@2024!"))
                .role(Role.SUPER_ADMIN)
                .subscriptionType(SubscriptionType.FREE)
                .isActive(true)
                .build());
            log.info("✅ Default admin user created: admin@sljobbank.lk / Admin@2024!");
        }
    }
}
