package com.loanapp.loanapp.repository;

import com.loanapp.loanapp.entity.Borrower;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowerRepository extends JpaRepository<Borrower, Long> {

}