package com.loanapp.loanapp.controller;

import com.loanapp.loanapp.entity.User;
import com.loanapp.loanapp.security.LoginRequest;
import com.loanapp.loanapp.security.LoginResponse;
import com.loanapp.loanapp.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(
                request.getEmail(),
                request.getPassword()
        );
    }
}