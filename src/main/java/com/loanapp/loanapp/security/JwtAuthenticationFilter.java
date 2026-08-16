package com.loanapp.loanapp.security;

import com.loanapp.loanapp.entity.User;
import com.loanapp.loanapp.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    // ==========================================
    // JWT FILTER
    // ==========================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");


        // ==========================================
        // CHECK AUTHORIZATION HEADER
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        String token =
                authHeader.substring(7);


        try {

            // ==========================================
            // EXTRACT EMAIL FROM JWT
            // ==========================================

            String email =
                    jwtService.extractEmail(token);


            // ==========================================
            // CHECK IF ALREADY AUTHENTICATED
            // ==========================================

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {


                // ==========================================
                // FIND USER
                // ==========================================

                User user =
                        userRepository
                                .findByEmail(email)
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                                );


                // ==========================================
                // GET USER ROLE
                // ==========================================

                String role =
                        "ROLE_" +
                                user.getRole().name();


                // ==========================================
                // CREATE AUTHENTICATION
                // ==========================================

                UsernamePasswordAuthenticationToken
                        authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                role
                                        )
                                )
                        );


                // ==========================================
                // STORE AUTHENTICATION
                // ==========================================

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }


        } catch (Exception e) {

            // Invalid or expired JWT
            SecurityContextHolder
                    .clearContext();
        }


        // ==========================================
        // CONTINUE REQUEST
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}