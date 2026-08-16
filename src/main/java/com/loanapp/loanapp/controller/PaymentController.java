package com.loanapp.loanapp.controller;

import com.loanapp.loanapp.entity.Payment;
import com.loanapp.loanapp.service.PaymentService;
import com.loanapp.loanapp.dto.PaymentRequest;
import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }


    // ==========================================
    // MAKE PAYMENT
    // ==========================================

    @PostMapping("/{loanId}")
    public Payment makePayment(
            @PathVariable Long loanId,
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return paymentService.makePayment(
                loanId,
                request.getAmount(),
                email
        );
    }


    // ==========================================
    // GET PAYMENTS FOR LOAN
    // ==========================================


// ==========================================
// GET PAYMENTS FOR LOAN
// ==========================================

    @GetMapping("/loan/{loanId}")
    public List<Payment> getPaymentsForLoan(
            @PathVariable Long loanId,
            Authentication authentication) {

        String email = authentication.getName();

        return paymentService.getPaymentsForLoan(
                loanId,
                email
        );
    }

}