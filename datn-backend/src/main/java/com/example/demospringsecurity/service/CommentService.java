package com.example.demospringsecurity.service;

import com.example.demospringsecurity.dto.request.CommentCreate;
import com.example.demospringsecurity.dto.request.VoucherCreate;
import com.example.demospringsecurity.dto.request.order.CommentEdit;
import com.example.demospringsecurity.dto.response.ResultPaginationResponse;
import com.example.demospringsecurity.model.Comment;
import com.example.demospringsecurity.model.Voucher;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface CommentService {
    Comment add(CommentCreate commentCreate);
    List<Comment> findAllByProductId(long productId);
    void findOne(Long id);
    Comment update(CommentEdit commentEdit);
    void delete(Long id);
    ResultPaginationResponse getAllVoucher(Specification<Voucher> specification, Pageable pageable);
}
