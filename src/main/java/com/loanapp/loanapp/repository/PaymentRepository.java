package com.loanapp.loanapp.repository;

import com.loanapp.loanapp.entity.Payment;
import com.loanapp.loanapp.entity.Loan;
import com.loanapp.loanapp.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    List<Payment> findByLoan(Loan loan);

    List<Payment> findByLoanId(Long loanId);

    List<Payment> findByBorrower(User borrower);
}