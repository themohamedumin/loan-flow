package com.loanapp.loanapp;

import com.loanapp.loanapp.entity.Loan;
import com.loanapp.loanapp.repository.LoanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LoanAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoanAppApplication.class, args);
	}

	}