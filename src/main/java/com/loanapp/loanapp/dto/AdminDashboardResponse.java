package com.loanapp.loanapp.dto;

public class AdminDashboardResponse {

    private long totalLoans;
    private long pendingLoans;
    private long approvedLoans;
    private long rejectedLoans;
    private long paidLoans;

    private double totalAmountLoaned;
    private double totalAmountRepaid;
    private double totalOutstanding;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(
            long totalLoans,
            long pendingLoans,
            long approvedLoans,
            long rejectedLoans,
            long paidLoans,
            double totalAmountLoaned,
            double totalAmountRepaid,
            double totalOutstanding) {

        this.totalLoans = totalLoans;
        this.pendingLoans = pendingLoans;
        this.approvedLoans = approvedLoans;
        this.rejectedLoans = rejectedLoans;
        this.paidLoans = paidLoans;
        this.totalAmountLoaned = totalAmountLoaned;
        this.totalAmountRepaid = totalAmountRepaid;
        this.totalOutstanding = totalOutstanding;
    }

    public long getTotalLoans() {
        return totalLoans;
    }

    public long getPendingLoans() {
        return pendingLoans;
    }

    public long getApprovedLoans() {
        return approvedLoans;
    }

    public long getRejectedLoans() {
        return rejectedLoans;
    }

    public long getPaidLoans() {
        return paidLoans;
    }

    public double getTotalAmountLoaned() {
        return totalAmountLoaned;
    }

    public double getTotalAmountRepaid() {
        return totalAmountRepaid;
    }

    public double getTotalOutstanding() {
        return totalOutstanding;
    }
}