package com.example.demospringsecurity.dto.request.order;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TotalPriceByDate {
    String date;
    double totalPrice;
}
