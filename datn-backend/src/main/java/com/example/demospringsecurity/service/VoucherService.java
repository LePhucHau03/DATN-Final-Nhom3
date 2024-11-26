package com.example.demospringsecurity.service;

import com.example.demospringsecurity.dto.request.VoucherCreate;
import com.example.demospringsecurity.dto.response.ResultPaginationResponse;
import com.example.demospringsecurity.model.Category;
import com.example.demospringsecurity.model.Voucher;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface VoucherService {
    Voucher add(VoucherCreate voucher);
    List<Voucher> findAll();
    void findOne(Long id);
    Voucher update(Voucher voucher);
    void delete(Long id);
    ResultPaginationResponse getAllVoucher(Specification<Voucher> specification, Pageable pageable);
}
