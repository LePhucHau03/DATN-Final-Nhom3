package com.example.demospringsecurity.service.impl;

import com.example.demospringsecurity.dto.request.CommentCreate;
import com.example.demospringsecurity.dto.request.order.CommentEdit;
import com.example.demospringsecurity.dto.response.ResultPaginationResponse;
import com.example.demospringsecurity.model.Comment;
import com.example.demospringsecurity.model.Voucher;
import com.example.demospringsecurity.repository.CommentRepository;
import com.example.demospringsecurity.repository.ProductRepository;
import com.example.demospringsecurity.repository.UserRepository;
import com.example.demospringsecurity.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Comment add(CommentCreate commentCreate) {
        return commentRepository.save(Comment.builder()
                        .message(commentCreate.getComment())
                        .product(productRepository.findById(commentCreate.getProductId()).orElseThrow(() -> new RuntimeException("Product Not Found")))
                        .user(userRepository.findById(commentCreate.getUserId()).orElseThrow(() -> new RuntimeException("User Not Found")))
                .build());
    }

    @Override
    public List<Comment> findAllByProductId(long productId) {
        return commentRepository.findAllByProductId(productId);
    }

    @Override
    public void findOne(Long id) {
        commentRepository.findById(id).orElseThrow(() -> new RuntimeException("Comment Not Found"));
    }

    @Override
    public Comment update(CommentEdit commentEdit) {
        findOne(commentEdit.getId());

        Comment currentComment = commentRepository.findById(commentEdit.getId()).orElseThrow(() -> new RuntimeException("Comment Not Found"));
        currentComment.setMessage(commentEdit.getComment());

        return commentRepository.save(currentComment);
    }

    @Override
    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

    @Override
    public ResultPaginationResponse getAllVoucher(Specification<Voucher> specification, Pageable pageable) {
        return null;
    }
}
