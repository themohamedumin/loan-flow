package com.loanapp.loanapp.repository;

import com.loanapp.loanapp.entity.Loan;
import com.loanapp.loanapp.entity.LoanStatus;
import com.loanapp.loanapp.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByBorrower(User borrower);

    List<Loan> findByStatus(LoanStatus status);
}