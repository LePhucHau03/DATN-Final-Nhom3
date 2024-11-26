package com.example.demospringsecurity.service.impl;

import com.example.demospringsecurity.dto.request.VoucherCreate;
import com.example.demospringsecurity.dto.response.CategoryResponse;
import com.example.demospringsecurity.dto.response.ResultPaginationResponse;
import com.example.demospringsecurity.model.Category;
import com.example.demospringsecurity.model.Voucher;
import com.example.demospringsecurity.repository.VoucherRepository;
import com.example.demospringsecurity.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;

    @Override
    public Voucher add(VoucherCreate voucher) {
        return voucherRepository.save(
                Voucher.builder()
                        .code(voucher.getCode())
                        .discount(voucher.getDiscount())
                        .expiry(voucher.getExpiry())
                        .minOrder(voucher.getMinOrder())
                .build());
    }

    @Override
    public List<Voucher> findAll() {
        return voucherRepository.findAll();
    }

    @Override
    public void findOne(Long id) {
        voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher Not Found"));
    }

    @Override
    public Voucher update(Voucher voucher) {
        findOne(voucher.getId());
        return voucherRepository.save(voucher);
    }

    @Override
    public void delete(Long id) {
        voucherRepository.deleteById(id);
    }

    @Override
    public ResultPaginationResponse getAllVoucher(Specification<Voucher> specification, Pageable pageable) {
        Page<Voucher> categoryPage = voucherRepository.findAll(specification, pageable);

        ResultPaginationResponse.Meta meta = ResultPaginationResponse.Meta.builder()
                .total(categoryPage.getTotalElements())
                .pages(categoryPage.getTotalPages())
                .page(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .build();
        List<Voucher> categoryResponses = categoryPage.getContent();

        return ResultPaginationResponse.builder()
                .meta(meta)
                .result(categoryResponses)
                .build();
    }
}
