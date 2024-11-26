package com.example.demospringsecurity.dto.request;

import lombok.Getter;

import java.time.Instant;

@Getter
public class VoucherCreate {
    String code;

    int discount;

    float minOrder;

    Instant expiry;
}
