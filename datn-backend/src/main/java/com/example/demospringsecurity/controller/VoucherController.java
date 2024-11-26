package com.example.demospringsecurity.controller;

import com.example.demospringsecurity.dto.request.CategoryUpdateRequestDTO;
import com.example.demospringsecurity.dto.request.VoucherCreate;
import com.example.demospringsecurity.dto.response.RestResponse;
import com.example.demospringsecurity.model.Category;
import com.example.demospringsecurity.model.Voucher;
import com.example.demospringsecurity.service.VoucherService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/voucher")
@Validated
public class VoucherController {
    private final VoucherService voucherService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody VoucherCreate voucherCreate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(voucherService.add(voucherCreate));
    }

    @PutMapping
    public ResponseEntity<?> update(@Valid @RequestBody Voucher voucher) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(voucherService.update(voucher));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAlla() {
        return ResponseEntity.ok().body(voucherService.findAll());
    }

    @DeleteMapping("/{id}")
    public RestResponse<?> delete(@Min(1)@PathVariable Long id) {
        voucherService.delete(id);
        return RestResponse.builder()
                .statusCode(204)
                .message("Deleted")
                .build();
    }
    @GetMapping
    public ResponseEntity<?> getAll(@Filter Specification<Voucher> specification, Pageable pageable) {
        return ResponseEntity.ok().body(voucherService.getAllVoucher(specification, pageable));
    }
}
