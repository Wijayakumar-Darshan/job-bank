package com.sljobbank.dto.response;
import com.sljobbank.entity.Role;
import com.sljobbank.entity.SubscriptionType;
import lombok.Builder;
import lombok.Data;
@Data @Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private UserDto user;
    private SystemSettingDto systemSettings;

    @Data @Builder
    public static class UserDto {
        private String id, fullName, email;
        private Role role;
        private SubscriptionType subscriptionType;
        private boolean isActive;
    }
    @Data @Builder
    public static class SystemSettingDto {
        private boolean paidModeEnabled;
        private Double monthlyPrice, yearlyPrice;
    }
}
