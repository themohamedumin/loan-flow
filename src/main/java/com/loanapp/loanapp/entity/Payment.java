package com.loanapp.loanapp.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "loan_id")
    private Loan loan;

    @ManyToOne
    @JoinColumn(name = "borrower_id")
    private User borrower;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Payment() {
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

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public Loan getLoan() {
        return loan;
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

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public void setBorrower(User borrower) {
        this.borrower = borrower;
    }
}