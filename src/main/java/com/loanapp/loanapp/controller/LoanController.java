package com.loanapp.loanapp.controller;

import com.loanapp.loanapp.dto.AdminDashboardResponse;
import com.loanapp.loanapp.dto.BorrowerDashboardResponse;
import com.loanapp.loanapp.dto.LoanRequest;
import com.loanapp.loanapp.entity.Loan;
import com.loanapp.loanapp.entity.User;
import com.loanapp.loanapp.repository.UserRepository;
import com.loanapp.loanapp.service.LoanService;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;
    private final UserRepository userRepository;

    public LoanController(
            LoanService loanService,
            UserRepository userRepository) {

        this.loanService = loanService;
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET ALL LOANS - ADMIN
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Loan> getAllLoans() {

        return loanService.getAllLoans();
    }


    // ==========================================
    // GET ONE LOAN
    // ==========================================

    @GetMapping("/{id}")
    public Loan getLoanById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Loan loan = loanService.getLoanById(id);

        // ADMIN can view any loan
        if (user.getRole().name().equals("ADMIN")) {
            return loan;
        }

        // BORROWER can only view their own loan
        if (loan.getBorrower() == null ||
                !loan.getBorrower()
                        .getId()
                        .equals(user.getId())) {

            throw new RuntimeException(
                    "You can only view your own loans"
            );
        }

        return loan;
    }


    // ==========================================
    // BORROWER DASHBOARD
    // ==========================================

    @GetMapping("/dashboard")
    public BorrowerDashboardResponse getBorrowerDashboard(
            Authentication authentication) {

        String email = authentication.getName();

        return loanService.getBorrowerDashboard(email);
    }


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/dashboard")
    public AdminDashboardResponse getAdminDashboard() {

        return loanService.getAdminDashboard();
    }


    // ==========================================
    // GET PENDING LOANS - ADMIN
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/pending")
    public List<Loan> getPendingLoans() {

        return loanService.getPendingLoans();
    }


    // ==========================================
    // GET MY LOANS - BORROWER
    // ==========================================

    @GetMapping("/my-loans")
    public List<Loan> getMyLoans(
            Authentication authentication) {

        String email = authentication.getName();

        return loanService.getLoansByBorrower(email);
    }


    // ==========================================
    // CREATE LOAN APPLICATION - BORROWER
    // ==========================================

    @PostMapping
    public Loan createLoan(
            @Valid @RequestBody LoanRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User borrower = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return loanService.createLoan(
                request,
                borrower
        );
    }


    // ==========================================
    // UPDATE LOAN - ADMIN
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Loan updateLoan(
            @PathVariable Long id,
            @Valid @RequestBody Loan loanDetails) {

        return loanService.updateLoan(
                id,
                loanDetails
        );
    }


    // ==========================================
    // APPROVE LOAN - ADMIN
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public Loan approveLoan(
            @PathVariable Long id) {

        return loanService.approveLoan(id);
    }


    // ==========================================
    // REJECT LOAN - ADMIN
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public Loan rejectLoan(
            @PathVariable Long id) {

        return loanService.rejectLoan(id);
    }


    // ==========================================
    // DELETE LOAN - ADMIN
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteLoan(
            @PathVariable Long id) {

        loanService.deleteLoan(id);
    }
}