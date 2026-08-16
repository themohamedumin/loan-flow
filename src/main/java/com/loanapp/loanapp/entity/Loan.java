package com.loanapp.loanapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @DecimalMin(
            value = "1000.0",
            message = "Loan amount must be at least 1000"
    )
    private Double amount;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    // Set automatically by the system.
    // Borrowers do not enter this value.
    private Double interestRate;

    @NotNull
    @DecimalMin(
            value = "1",
            message = "Duration must be at least 1 month"
    )
    private Integer durationMonths;

    private Double totalRepayment;

    private Double monthlyRepayment;

    private Double amountPaid = 0.0;

    private Double remainingBalance;

    @ManyToOne
    @JoinColumn(name = "borrower_id")
    private User borrower;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Loan() {
    }


    // ==========================================
    // GETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public Double getTotalRepayment() {
        return totalRepayment;
    }

    public Double getMonthlyRepayment() {
        return monthlyRepayment;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public Double getRemainingBalance() {
        return remainingBalance;
    }

    public User getBorrower() {
        return borrower;
    }


    // ==========================================
    // SETTERS
    // ==========================================

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public void setTotalRepayment(Double totalRepayment) {
        this.totalRepayment = totalRepayment;
    }

    public void setMonthlyRepayment(Double monthlyRepayment) {
        this.monthlyRepayment = monthlyRepayment;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public void setRemainingBalance(Double remainingBalance) {
        this.remainingBalance = remainingBalance;
    }

    public void setBorrower(User borrower) {
        this.borrower = borrower;
    }
}