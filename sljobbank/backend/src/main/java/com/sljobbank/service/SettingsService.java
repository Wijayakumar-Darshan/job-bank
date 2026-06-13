package com.sljobbank.service;

import com.sljobbank.entity.SystemSetting;
import com.sljobbank.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class SettingsService {
    private final SystemSettingRepository repo;

    public SystemSetting get() {
        return repo.findFirstByOrderByIdAsc().orElseGet(() -> repo.save(
            SystemSetting.builder()
                .bankName("Bank of Ceylon").accountNumber("7890-1234-5678")
                .accountHolder("SL Job Bank (Pvt) Ltd").build()
        ));
    }

    @Transactional
    public SystemSetting update(SystemSetting updated) {
        SystemSetting existing = get();
        existing.setPaidModeEnabled(updated.getPaidModeEnabled());
        existing.setMonthlyPrice(updated.getMonthlyPrice());
        existing.setYearlyPrice(updated.getYearlyPrice());
        existing.setBankName(updated.getBankName());
        existing.setAccountNumber(updated.getAccountNumber());
        existing.setAccountHolder(updated.getAccountHolder());
        return repo.save(existing);
    }

    @Transactional
    public SystemSetting togglePaidMode() {
        SystemSetting s = get();
        s.setPaidModeEnabled(!s.getPaidModeEnabled());
        return repo.save(s);
    }
}
