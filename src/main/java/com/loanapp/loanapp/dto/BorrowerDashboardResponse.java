package com.loanapp.loanapp.dto;

public class BorrowerDashboardResponse {

    private long totalLoans;
    private long pendingLoans;
    private long approvedLoans;
    private long rejectedLoans;
    private long paidLoans;

    private double totalBorrowed;
    private double totalPaid;
    private double totalOutstanding;

    public BorrowerDashboardResponse() {
    }

    public BorrowerDashboardResponse(
            long totalLoans,
            long pendingLoans,
            long approvedLoans,
            long rejectedLoans,
            long paidLoans,
            double totalBorrowed,
            double totalPaid,
            double totalOutstanding) {

        this.totalLoans = totalLoans;
        this.pendingLoans = pendingLoans;
        this.approvedLoans = approvedLoans;
        this.rejectedLoans = rejectedLoans;
        this.paidLoans = paidLoans;
        this.totalBorrowed = totalBorrowed;
        this.totalPaid = totalPaid;
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

    public double getTotalBorrowed() {
        return totalBorrowed;
    }

    public double getTotalPaid() {
        return totalPaid;
    }

    public double getTotalOutstanding() {
        return totalOutstanding;
    }
}