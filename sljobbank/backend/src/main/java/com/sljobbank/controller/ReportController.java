package com.sljobbank.controller;

import com.sljobbank.report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<byte[]> userReport(@RequestParam(defaultValue = "pdf") String format)
        throws Exception {
        if ("excel".equalsIgnoreCase(format)) {
            byte[] data = reportService.generateUserReportExcel();
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"user_report.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
        }
        byte[] data = reportService.generateUserReportPdf();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"user_report.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(data);
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasAnyRole('COUNSELOR','SUPER_ADMIN')")
    public ResponseEntity<byte[]> jobReport() throws Exception {
        byte[] data = reportService.generateJobReportPdf();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"job_report.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(data);
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<byte[]> revenueReport() throws Exception {
        byte[] data = reportService.generateRevenueReportPdf();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"revenue_report.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(data);
    }
}
