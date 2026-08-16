package com.loanapp.loanapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // ==========================================
    // JWT CONFIGURATION
    // ==========================================

    private static final String SECRET =
            "my-super-secret-key-for-loan-app-jwt-token-2026";

    private static final long EXPIRATION_TIME =
            24 * 60 * 60 * 1000L; // 24 hours


    // ==========================================
    // SECRET KEY
    // ==========================================

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );


    // ==========================================
    // GENERATE JWT TOKEN
    // ==========================================

    public String generateToken(String email) {

        Date issuedAt = new Date();

        Date expiration =
                new Date(
                        issuedAt.getTime()
                                + EXPIRATION_TIME
                );


        return Jwts.builder()

                // User identity
                .subject(email)

                // Token creation time
                .issuedAt(issuedAt)

                // Token expiration
                .expiration(expiration)

                // Sign token
                .signWith(key)

                // Build token
                .compact();
    }


    // ==========================================
    // EXTRACT EMAIL FROM TOKEN
    // ==========================================

    public String extractEmail(String token) {

        return Jwts.parser()

                // Verify token signature
                .verifyWith(key)

                .build()

                // Parse JWT
                .parseSignedClaims(token)

                // Get payload
                .getPayload()

                // Get subject (email)
                .getSubject();
    }
}