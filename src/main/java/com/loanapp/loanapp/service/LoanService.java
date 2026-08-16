package com.loanapp.loanapp.service;

import com.loanapp.loanapp.dto.AdminDashboardResponse;
import com.loanapp.loanapp.dto.BorrowerDashboardResponse;
import com.loanapp.loanapp.dto.LoanRequest;
import com.loanapp.loanapp.entity.Loan;
import com.loanapp.loanapp.entity.LoanStatus;
import com.loanapp.loanapp.entity.User;
import com.loanapp.loanapp.repository.LoanRepository;
import com.loanapp.loanapp.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    // Interest rate controlled by the system
    private static final double INTEREST_RATE = 3.0;


    public LoanService(
            LoanRepository loanRepository,
            UserRepository userRepository) {

        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET ALL LOANS
    // ==========================================

    public List<Loan> getAllLoans() {

        return loanRepository.findAll();
    }


    // ==========================================
    // GET ONE LOAN
    // ==========================================

    public Loan getLoanById(Long id) {

        return loanRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));
    }


    // ==========================================
    // GET MY LOANS
    // ==========================================

    public List<Loan> getLoansByBorrower(String email) {

        User borrower = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return loanRepository.findByBorrower(borrower);
    }


    // ==========================================
    // GET PENDING LOANS
    // ==========================================

    public List<Loan> getPendingLoans() {

        return loanRepository.findByStatus(
                LoanStatus.PENDING
        );
    }


    // ==========================================
    // CREATE LOAN APPLICATION
    // ==========================================

    public Loan createLoan(
            LoanRequest request,
            User borrower) {

        Loan loan = new Loan();

        // Borrower-controlled values
        loan.setAmount(request.getAmount());
        loan.setDurationMonths(request.getDurationMonths());

        // System-controlled interest rate
        loan.setInterestRate(INTEREST_RATE);

        // Every new loan starts as PENDING
        loan.setStatus(LoanStatus.PENDING);

        // No payments have been made
        loan.setAmountPaid(0.0);


        // ==========================================
        // CALCULATE INTEREST
        // ==========================================

        double interest =
                loan.getAmount()
                        * (loan.getInterestRate() / 100)
                        * (loan.getDurationMonths() / 12.0);


        // ==========================================
        // TOTAL REPAYMENT
        // ==========================================

        double totalRepayment =
                loan.getAmount() + interest;


        // ==========================================
        // MONTHLY REPAYMENT
        // ==========================================

        double monthlyRepayment =
                totalRepayment / loan.getDurationMonths();


        loan.setTotalRepayment(totalRepayment);

        loan.setMonthlyRepayment(monthlyRepayment);


        // ==========================================
        // REMAINING BALANCE
        // ==========================================

        loan.setRemainingBalance(totalRepayment);


        // ==========================================
        // ATTACH BORROWER
        // ==========================================

        loan.setBorrower(borrower);


        return loanRepository.save(loan);
    }


    // ==========================================
    // UPDATE LOAN
    // ADMIN
    // ==========================================

    public Loan updateLoan(
            Long id,
            Loan loanDetails) {

        Loan loan = getLoanById(id);

        loan.setAmount(loanDetails.getAmount());

        /*
         * Interest rate remains controlled by
         * the system.
         */
        loan.setInterestRate(INTEREST_RATE);

        loan.setDurationMonths(
                loanDetails.getDurationMonths()
        );


        // ==========================================
        // RECALCULATE INTEREST
        // ==========================================

        double interest =
                loan.getAmount()
                        * (loan.getInterestRate() / 100)
                        * (loan.getDurationMonths() / 12.0);


        // ==========================================
        // RECALCULATE TOTAL REPAYMENT
        // ==========================================

        double totalRepayment =
                loan.getAmount() + interest;


        // ==========================================
        // RECALCULATE MONTHLY REPAYMENT
        // ==========================================

        double monthlyRepayment =
                totalRepayment / loan.getDurationMonths();


        loan.setTotalRepayment(totalRepayment);

        loan.setMonthlyRepayment(monthlyRepayment);

        loan.setRemainingBalance(totalRepayment);


        return loanRepository.save(loan);
    }


    // ==========================================
    // APPROVE LOAN
    // ==========================================

    public Loan approveLoan(Long id) {

        Loan loan = getLoanById(id);

        if (loan.getStatus() != LoanStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending loans can be approved"
            );
        }

        loan.setStatus(LoanStatus.APPROVED);

        return loanRepository.save(loan);
    }


    // ==========================================
    // REJECT LOAN
    // ==========================================

    public Loan rejectLoan(Long id) {

        Loan loan = getLoanById(id);

        if (loan.getStatus() != LoanStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending loans can be rejected"
            );
        }

        loan.setStatus(LoanStatus.REJECTED);

        return loanRepository.save(loan);
    }


    // ==========================================
    // DELETE LOAN
    // ==========================================

    public void deleteLoan(Long id) {

        loanRepository.deleteById(id);
    }


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    public AdminDashboardResponse getAdminDashboard() {

        List<Loan> loans = loanRepository.findAll();

        long totalLoans = loans.size();

        long pendingLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.PENDING)
                .count();

        long approvedLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.APPROVED)
                .count();

        long rejectedLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.REJECTED)
                .count();

        long paidLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.PAID)
                .count();


        double totalAmountLoaned = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.APPROVED
                                || loan.getStatus() == LoanStatus.PAID)
                .mapToDouble(Loan::getAmount)
                .sum();


        double totalAmountRepaid = loans.stream()
                .mapToDouble(loan ->
                        loan.getAmountPaid() != null
                                ? loan.getAmountPaid()
                                : 0.0)
                .sum();


        double totalOutstanding = loans.stream()
                .mapToDouble(loan ->
                        loan.getRemainingBalance() != null
                                ? loan.getRemainingBalance()
                                : 0.0)
                .sum();


        return new AdminDashboardResponse(
                totalLoans,
                pendingLoans,
                approvedLoans,
                rejectedLoans,
                paidLoans,
                totalAmountLoaned,
                totalAmountRepaid,
                totalOutstanding
        );
    }


    // ==========================================
    // BORROWER DASHBOARD
    // ==========================================

    public BorrowerDashboardResponse getBorrowerDashboard(
            String email) {

        User borrower = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        List<Loan> loans =
                loanRepository.findByBorrower(borrower);


        long totalLoans = loans.size();


        long pendingLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.PENDING)
                .count();


        long approvedLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.APPROVED)
                .count();


        long rejectedLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.REJECTED)
                .count();


        long paidLoans = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.PAID)
                .count();


        double totalBorrowed = loans.stream()
                .filter(loan ->
                        loan.getStatus() == LoanStatus.APPROVED
                                || loan.getStatus() == LoanStatus.PAID)
                .mapToDouble(Loan::getAmount)
                .sum();


        double totalPaid = loans.stream()
                .mapToDouble(loan ->
                        loan.getAmountPaid() != null
                                ? loan.getAmountPaid()
                                : 0.0)
                .sum();


        double totalOutstanding = loans.stream()
                .mapToDouble(loan ->
                        loan.getRemainingBalance() != null
                                ? loan.getRemainingBalance()
                                : 0.0)
                .sum();


        return new BorrowerDashboardResponse(
                totalLoans,
                pendingLoans,
                approvedLoans,
                rejectedLoans,
                paidLoans,
                totalBorrowed,
                totalPaid,
                totalOutstanding
        );
    }
}