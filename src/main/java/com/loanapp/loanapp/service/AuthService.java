package com.loanapp.loanapp.service;

import com.loanapp.loanapp.entity.Role;
import com.loanapp.loanapp.entity.User;
import com.loanapp.loanapp.repository.UserRepository;
import com.loanapp.loanapp.security.JwtService;
import com.loanapp.loanapp.security.LoginResponse;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // ==========================================
    // REGISTER
    // ==========================================

    public User register(User user) {

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {

            throw new RuntimeException(
                    "Email is already registered"
            );
        }


        // Hash password before saving
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );


        // Every new registration is a borrower
        user.setRole(Role.BORROWER);


        // Save user
        return userRepository.save(user);
    }


    // ==========================================
    // LOGIN
    // ==========================================

    public LoginResponse login(
            String email,
            String password) {

        // Find user
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );


        // Verify password
        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );


        // Reject invalid password
        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // Generate JWT token
        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        // Return login response
        return new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    public void resetPassword(
            String email,
            String newPassword) {

        // Find user
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        // Hash new password
        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );


        // Save updated user
        userRepository.save(user);
    }
}