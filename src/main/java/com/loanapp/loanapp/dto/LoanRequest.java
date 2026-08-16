package com.loanapp.loanapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class LoanRequest {

    @NotNull
    @DecimalMin(
            value = "1000.0",
            message = "Loan amount must be at least 1000"
    )
    private Double amount;

    @NotNull
    @DecimalMin(
            value = "1",
            message = "Duration must be at least 1 month"
    )
    private Integer durationMonths;


    public LoanRequest() {
    }


    public Double getAmount() {
        return amount;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }


    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }
}