package com.loanapp.loanapp.controller;

import com.loanapp.loanapp.entity.Borrower;
import com.loanapp.loanapp.repository.BorrowerRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowers")
public class BorrowerController {


    private final BorrowerRepository borrowerRepository;


    public BorrowerController(BorrowerRepository borrowerRepository) {
        this.borrowerRepository = borrowerRepository;
    }


    @GetMapping
    public List<Borrower> getBorrowers() {
        return borrowerRepository.findAll();
    }

    @PostMapping
    public Borrower createBorrower(@RequestBody Borrower borrower) {
        return borrowerRepository.save(borrower);
    }


}