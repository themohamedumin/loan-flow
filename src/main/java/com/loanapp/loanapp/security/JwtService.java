package com.loanapp.loanapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // ==========================================
    // JWT CONFIGURATION
    // ==========================================

    @Value("${jwt.secret}")
    private String secret;

    private static final long EXPIRATION_TIME =
            24 * 60 * 60 * 1000L; // 24 hours


    // ==========================================
    // SECRET KEY
    // ==========================================

    private SecretKey getKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }


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
                .signWith(getKey())

                // Build token
                .compact();
    }


    // ==========================================
    // EXTRACT EMAIL FROM TOKEN
    // ==========================================

    public String extractEmail(String token) {

        return Jwts.parser()

                // Verify token signature
                .verifyWith(getKey())

                .build()

                // Parse JWT
                .parseSignedClaims(token)

                // Get payload
                .getPayload()

                // Get subject (email)
                .getSubject();
    }
}