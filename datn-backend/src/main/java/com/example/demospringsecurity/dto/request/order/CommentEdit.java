package com.example.demospringsecurity.dto.request.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CommentEdit {
    @Min(1)
    private long id;
    @NotBlank
    private String comment;
}
