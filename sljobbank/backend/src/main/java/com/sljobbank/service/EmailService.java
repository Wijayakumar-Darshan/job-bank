package com.sljobbank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

// @Service   <-- disable for now
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private JavaMailSender mailSender;

    @Value("${spring.mail.username}") private String fromEmail;

    // ── Welcome Email ─────────────────────────────────────────
    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        sendHtml(toEmail,
            "Welcome to SL Job Bank 🇱🇰",
            buildWelcomeHtml(fullName));
    }

    // ── Subscription Activated ────────────────────────────────
    @Async
    public void sendSubscriptionConfirmation(String toEmail, String fullName, double amount, String plan) {
        sendHtml(toEmail,
            "Subscription Activated — SL Job Bank",
            buildSubscriptionHtml(fullName, amount, plan));
    }

    // ── Password Reset ────────────────────────────────────────
    @Async
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetToken) {
        String resetUrl = "https://sljobbank.lk/reset-password?token=" + resetToken;
        sendHtml(toEmail,
            "Reset Your SL Job Bank Password",
            buildPasswordResetHtml(fullName, resetUrl));
    }

    // ── Generic Send ──────────────────────────────────────────
    private void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    // ── HTML Templates ────────────────────────────────────────
    private String buildWelcomeHtml(String name) {
        return emailWrapper("Welcome to SL Job Bank! 🇱🇰",
            "<p>Hi <strong>" + name + "</strong>,</p>" +
            "<p>Welcome to <strong>SL Job Bank</strong> — Sri Lanka's most comprehensive career guidance platform!</p>" +
            "<p>You can now:</p>" +
            "<ul>" +
            "<li>🗂️ Explore all 16 career clusters</li>" +
            "<li>💼 Browse 600+ career profiles</li>" +
            "<li>📚 See exactly which A/L subjects you need</li>" +
            "<li>🏫 Compare institutes and course fees</li>" +
            "<li>💰 View salary ranges in LKR</li>" +
            "</ul>" +
            "<a href='https://sljobbank.lk/student/dashboard' style='display:inline-block;margin-top:16px;padding:12px 24px;background:#0A2E1C;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;'>Start Exploring →</a>"
        );
    }

    private String buildSubscriptionHtml(String name, double amount, String plan) {
        return emailWrapper("Subscription Activated ✅",
            "<p>Hi <strong>" + name + "</strong>,</p>" +
            "<p>Your <strong>" + plan + " subscription</strong> has been activated successfully.</p>" +
            "<table style='width:100%;border-collapse:collapse;margin:16px 0'>" +
            "<tr><td style='padding:8px;background:#F2F5F3;font-weight:600'>Plan</td><td style='padding:8px'>" + plan + "</td></tr>" +
            "<tr><td style='padding:8px;background:#F2F5F3;font-weight:600'>Amount</td><td style='padding:8px'>LKR " + String.format("%.2f", amount) + "</td></tr>" +
            "<tr><td style='padding:8px;background:#F2F5F3;font-weight:600'>Status</td><td style='padding:8px;color:#059669;font-weight:700'>Active ✅</td></tr>" +
            "</table>" +
            "<p>You now have full access to all career guidance features.</p>" +
            "<a href='https://sljobbank.lk/student/dashboard' style='display:inline-block;margin-top:16px;padding:12px 24px;background:#0A2E1C;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;'>Go to Dashboard →</a>"
        );
    }

    private String buildPasswordResetHtml(String name, String resetUrl) {
        return emailWrapper("Reset Your Password 🔑",
            "<p>Hi <strong>" + name + "</strong>,</p>" +
            "<p>We received a request to reset your SL Job Bank password.</p>" +
            "<p>Click the button below to reset it. This link expires in <strong>1 hour</strong>.</p>" +
            "<a href='" + resetUrl + "' style='display:inline-block;margin:16px 0;padding:12px 24px;background:#0A2E1C;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;'>Reset Password →</a>" +
            "<p style='color:#6B7280;font-size:12px'>If you didn't request a password reset, please ignore this email. Your account is safe.</p>"
        );
    }

    private String emailWrapper(String title, String body) {
        return "<!DOCTYPE html><html><body style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#F2F5F3;margin:0;padding:20px'>" +
            "<div style='max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.08)'>" +
            "<div style='background:#0A2E1C;padding:24px 28px;display:flex;align-items:center;gap:12px'>" +
            "<span style='font-size:24px'>🇱🇰</span>" +
            "<h1 style='color:#E8A200;font-size:18px;font-weight:900;margin:0'>SL Job Bank</h1>" +
            "</div>" +
            "<div style='padding:28px'>" +
            "<h2 style='font-size:18px;color:#111;margin-top:0'>" + title + "</h2>" +
            body +
            "</div>" +
            "<div style='background:#F2F5F3;padding:16px 28px;text-align:center'>" +
            "<p style='color:#9CA3AF;font-size:11px;margin:0'>© 2024 SL Job Bank — Sri Lanka Career Guidance Platform</p>" +
            "</div></div></body></html>";
    }
}
