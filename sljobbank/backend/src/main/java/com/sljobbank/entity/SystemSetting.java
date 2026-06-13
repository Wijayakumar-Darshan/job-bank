package com.sljobbank.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "system_settings")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SystemSetting {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Builder.Default private Boolean paidModeEnabled = false;
    @Builder.Default private Double monthlyPrice = 990.0;
    @Builder.Default private Double yearlyPrice  = 8900.0;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private String qrCodeImage;
}
