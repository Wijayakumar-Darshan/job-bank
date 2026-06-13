package com.sljobbank.security.jwt;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${JWT_SECRET}")
    private String secret;

    @Value("${jwt.access-token-expiry}")
    private long accessExpiry;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshExpiry;

    private SecretKey key;

    @PostConstruct
    public void init() {

        if (secret == null || secret.isBlank()) {
            throw new RuntimeException("JWT_SECRET is missing");
        }

        key = Keys.hmacShaKeyFor(
                Base64.getDecoder().decode(secret)
        );
    }

    // Generate Access Token
    public String generateAccessToken(String email, String role) {

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + accessExpiry)
                )
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    // Generate Refresh Token
    public String generateRefreshToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + refreshExpiry)
                )
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    // Extract Username
    public String extractUsername(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String extractEmail(String token) {
        return extractUsername(token);
    }

    // Validate Token
    public boolean validateToken(String token) {

        try {

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }

    public boolean isValid(String token) {
        return validateToken(token);
    }

}
