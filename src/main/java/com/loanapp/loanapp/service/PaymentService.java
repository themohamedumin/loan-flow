package com.loanapp.loanapp.service;

import com.loanapp.loanapp.entity.Loan;
import com.loanapp.loanapp.entity.LoanStatus;
import com.loanapp.loanapp.entity.Payment;
import com.loanapp.loanapp.entity.User;
import com.loanapp.loanapp.repository.LoanRepository;
import com.loanapp.loanapp.repository.PaymentRepository;
import com.loanapp.loanapp.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            LoanRepository loanRepository,
            UserRepository userRepository) {

        this.paymentRepository = paymentRepository;
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // MAKE PAYMENT
    // ==========================================

    public Payment makePayment(
            Long loanId,
            Double amount,
            String email) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found"
                        ));


        // ==========================================
        // FIND BORROWER
        // ==========================================

        User borrower = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));


        // ==========================================
        // MAKE SURE LOAN BELONGS TO BORROWER
        // ==========================================

        if (loan.getBorrower() == null ||
                !loan.getBorrower()
                        .getId()
                        .equals(borrower.getId())) {

            throw new RuntimeException(
                    "You can only make payments on your own loans"
            );
        }


        // ==========================================
        // ONLY APPROVED LOANS
        // ==========================================

        if (loan.getStatus() != LoanStatus.APPROVED) {

            throw new RuntimeException(
                    "Payments can only be made on approved loans"
            );
        }


        // ==========================================
        // VALIDATE PAYMENT
        // ==========================================

        if (amount == null || amount <= 0) {

            throw new RuntimeException(
                    "Payment amount must be greater than zero"
            );
        }


        // ==========================================
        // CHECK REMAINING BALANCE
        // ==========================================

        if (loan.getRemainingBalance() == null) {

            throw new RuntimeException(
                    "Loan remaining balance is not set"
            );
        }


        // ==========================================
        // PAYMENT CANNOT EXCEED BALANCE
        // ==========================================

        if (amount > loan.getRemainingBalance()) {

            throw new RuntimeException(
                    "Payment cannot exceed remaining balance"
            );
        }


        // ==========================================
        // CREATE PAYMENT RECORD
        // ==========================================

        Payment payment = new Payment();

        payment.setAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setLoan(loan);
        payment.setBorrower(borrower);


        // ==========================================
        // UPDATE LOAN
        // ==========================================

        double newAmountPaid =
                loan.getAmountPaid() + amount;

        double newRemainingBalance =
                loan.getRemainingBalance() - amount;

        loan.setAmountPaid(newAmountPaid);


        // Prevent tiny decimal leftovers
        if (newRemainingBalance <= 0.01) {

            newRemainingBalance = 0.0;

            loan.setStatus(LoanStatus.PAID);
        }

        loan.setRemainingBalance(newRemainingBalance);


        // ==========================================
        // MARK LOAN AS PAID
        // ==========================================

        if (newRemainingBalance == 0.0) {

            loan.setStatus(LoanStatus.PAID);
        }


        // ==========================================
        // SAVE LOAN
        // ==========================================

        loanRepository.save(loan);


        // ==========================================
        // SAVE PAYMENT
        // ==========================================

        return paymentRepository.save(payment);
    }


    // ==========================================
    // GET PAYMENTS FOR LOAN
    // ==========================================

    public List<Payment> getPaymentsForLoan(
            Long loanId,
            String email) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // ADMIN can view payments for any loan
        if (user.getRole().name().equals("ADMIN")) {

            return paymentRepository.findByLoanId(loanId);
        }

        // BORROWER can only view payments for their own loan
        if (loan.getBorrower() == null ||
                !loan.getBorrower()
                        .getId()
                        .equals(user.getId())) {

            throw new RuntimeException(
                    "You can only view payments for your own loans"
            );
        }

        return paymentRepository.findByLoanId(loanId);
    }}