package com.example.demospringsecurity.repository;

import com.example.demospringsecurity.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VoucherRepository extends JpaRepository<Voucher, Long> , JpaSpecificationExecutor<Voucher> {
}
