package com.loanapp.loanapp.config;

import com.loanapp.loanapp.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // ==========================================
    // SECURITY FILTER CHAIN
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // ==========================================
                // CSRF
                // ==========================================

                .csrf(csrf -> csrf.disable())


                // ==========================================
                // CORS
                // ==========================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )


                // ==========================================
                // SESSION MANAGEMENT
                // ==========================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // ==========================================
                // AUTHORIZATION
                // ==========================================

                .authorizeHttpRequests(auth -> auth


                        // ----------------------------------
                        // CORS PREFLIGHT REQUESTS
                        // ----------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // ----------------------------------
                        // PUBLIC AUTH ENDPOINTS
                        // ----------------------------------

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()


                        // ----------------------------------
                        // ADMIN ENDPOINTS
                        // ----------------------------------

                        .requestMatchers(
                                "/api/loans/admin/**"
                        ).hasRole("ADMIN")


                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")


                        // ----------------------------------
                        // ADMIN LOAN ACTIONS
                        // ----------------------------------

                        .requestMatchers(
                                "/api/loans/*/approve",
                                "/api/loans/*/reject"
                        ).hasRole("ADMIN")


                        // ----------------------------------
                        // EVERYTHING ELSE
                        // ----------------------------------

                        .anyRequest().authenticated()
                )


                // ==========================================
                // JWT AUTHENTICATION FILTER
                // ==========================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // ------------------------------------------
        // FRONTEND ORIGIN
        // ------------------------------------------

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );


        // ------------------------------------------
        // HTTP METHODS
        // ------------------------------------------

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );


        // ------------------------------------------
        // HEADERS
        // ------------------------------------------

        configuration.setAllowedHeaders(
                List.of("*")
        );


        // ------------------------------------------
        // CREDENTIALS
        // ------------------------------------------

        configuration.setAllowCredentials(true);


        // ------------------------------------------
        // REGISTER CORS CONFIGURATION
        // ------------------------------------------

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}