package com.example.demospringsecurity.dto.request;

import lombok.Getter;

@Getter
public class CommentCreate {
    private String comment;
    private long userId;
    private long productId;
}
