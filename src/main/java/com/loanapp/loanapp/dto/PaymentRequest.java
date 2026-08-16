package com.loanapp.loanapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class PaymentRequest {

    @NotNull
    @DecimalMin(
            value = "1.0",
            message = "Payment must be at least 1"
    )
    private Double amount;

    public PaymentRequest() {
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}