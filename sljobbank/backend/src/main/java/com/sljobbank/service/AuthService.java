package com.sljobbank.service;

import com.sljobbank.dto.request.*;
import com.sljobbank.dto.response.*;
import com.sljobbank.entity.*;
import com.sljobbank.repository.*;
import com.sljobbank.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final SystemSettingRepository settingRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();

        String access  = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refresh = jwtUtil.generateRefreshToken(user.getEmail());

        SystemSetting setting = settingRepo.findFirstByOrderByIdAsc().orElse(new SystemSetting());

        return AuthResponse.builder()
            .token(access)
            .refreshToken(refresh)
            .user(AuthResponse.UserDto.builder()
                .id(user.getId()).fullName(user.getFullName()).email(user.getEmail())
                .role(user.getRole()).subscriptionType(user.getSubscriptionType())
                .isActive(user.isActive()).build())
            .systemSettings(AuthResponse.SystemSettingDto.builder()
                .paidModeEnabled(setting.getPaidModeEnabled())
                .monthlyPrice(setting.getMonthlyPrice())
                .yearlyPrice(setting.getYearlyPrice()).build())
            .build();
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");

        User user = User.builder()
            .fullName(req.getFullName()).email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role(Role.STUDENT).build();
        userRepo.save(user);

        String token = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refresh = jwtUtil.generateRefreshToken(user.getEmail());

        return AuthResponse.builder().token(token).refreshToken(refresh)
            .user(AuthResponse.UserDto.builder()
                .id(user.getId()).fullName(user.getFullName()).email(user.getEmail())
                .role(user.getRole()).subscriptionType(user.getSubscriptionType())
                .isActive(true).build())
            .build();
    }
}
