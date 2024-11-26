package com.example.demospringsecurity.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForgotPassDTO {
    String email;
    String firstName;
    String lastName;
}
