package com.sljobbank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

/**
 * PayHere Payment Gateway Integration
 * Docs: https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PayHereService {

    @Value("${payhere.merchant-id}")     private String merchantId;
    @Value("${payhere.merchant-secret}") private String merchantSecret;
    @Value("${payhere.api-url}")         private String apiUrl;

    /**
     * Generate PayHere checkout parameters for frontend
     */
    public Map<String, String> buildCheckoutParams(
        String orderId,
        String customerName,
        String customerEmail,
        String customerPhone,
        double amount,
        String currency
    ) {
        String hash = generateHash(orderId, amount, currency);

        Map<String, String> params = new HashMap<>();
        params.put("merchant_id",    merchantId);
        params.put("return_url",     "https://sljobbank.lk/payment/success");
        params.put("cancel_url",     "https://sljobbank.lk/payment/cancel");
        params.put("notify_url",     "https://api.sljobbank.lk/api/subscriptions/notify");
        params.put("order_id",       orderId);
        params.put("items",          "SL Job Bank Subscription");
        params.put("currency",       currency);
        params.put("amount",         String.format("%.2f", amount));
        params.put("first_name",     customerName.split(" ")[0]);
        params.put("last_name",      customerName.contains(" ") ? customerName.split(" ", 2)[1] : "");
        params.put("email",          customerEmail);
        params.put("phone",          customerPhone != null ? customerPhone : "");
        params.put("address",        "Sri Lanka");
        params.put("city",           "Colombo");
        params.put("country",        "Sri Lanka");
        params.put("hash",           hash);
        params.put("checkout_url",   apiUrl);

        return params;
    }

    /**
     * Verify PayHere webhook notification
     * Called when PayHere POSTs to /api/subscriptions/notify
     */
    public boolean verifyNotification(
        String merchantId,
        String orderId,
        String payhereAmount,
        String payhereCurrency,
        String statusCode,
        String md5sig
    ) {
        try {
            String secretHash = md5(merchantSecret.toUpperCase());
            String local = md5(merchantId + orderId + payhereAmount + payhereCurrency + statusCode + secretHash);
            return local.equalsIgnoreCase(md5sig);
        } catch (Exception e) {
            log.error("PayHere signature verification failed", e);
            return false;
        }
    }

    /**
     * Generate MD5 hash for PayHere request
     * Format: MD5( merchant_id + order_id + amount + currency + MD5(merchant_secret).upper() )
     */
    public String generateHash(String orderId, double amount, String currency) {
        try {
            String secretHash = md5(merchantSecret.toUpperCase());
            String raw = merchantId + orderId + String.format("%.2f", amount) + currency + secretHash;
            return md5(raw).toUpperCase();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PayHere hash", e);
        }
    }

    private String md5(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] hash = md.digest(input.getBytes("UTF-8"));
        BigInteger number = new BigInteger(1, hash);
        StringBuilder hex = new StringBuilder(number.toString(16));
        while (hex.length() < 32) hex.insert(0, '0');
        return hex.toString();
    }
}
