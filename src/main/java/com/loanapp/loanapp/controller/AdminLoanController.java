package com.loanapp.loanapp.controller;

import com.loanapp.loanapp.entity.Loan;
import com.loanapp.loanapp.service.LoanService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/loans")
public class AdminLoanController {

    private final LoanService loanService;

    public AdminLoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/{id}/approve")
    public Loan approveLoan(@PathVariable Long id) {

        return loanService.approveLoan(id);
    }

    @PostMapping("/{id}/reject")
    public Loan rejectLoan(@PathVariable Long id) {

        return loanService.rejectLoan(id);
    }
}