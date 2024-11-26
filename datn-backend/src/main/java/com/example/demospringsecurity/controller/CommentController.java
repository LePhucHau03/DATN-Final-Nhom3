package com.example.demospringsecurity.controller;

import com.example.demospringsecurity.dto.request.CommentCreate;
import com.example.demospringsecurity.dto.request.VoucherCreate;
import com.example.demospringsecurity.dto.request.order.CommentEdit;
import com.example.demospringsecurity.dto.response.RestResponse;
import com.example.demospringsecurity.model.Comment;
import com.example.demospringsecurity.model.Voucher;
import com.example.demospringsecurity.service.CommentService;
import com.example.demospringsecurity.service.VoucherService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/comment")
@Validated
public class CommentController {
    private final CommentService voucherService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CommentCreate voucherCreate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(voucherService.add(voucherCreate));
    }

    @PutMapping
    public ResponseEntity<?> update(@Valid @RequestBody CommentEdit commentEdit) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(voucherService.update(commentEdit));
    }

    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAlla(@Min(1)@PathVariable Long id) {
        return ResponseEntity.ok().body(voucherService.findAllByProductId(id));
    }

    @DeleteMapping("/{id}")
    public RestResponse<?> delete(@Min(1)@PathVariable Long id) {
        voucherService.delete(id);
        return RestResponse.builder()
                .statusCode(204)
                .message("Deleted")
                .build();
    }
}
