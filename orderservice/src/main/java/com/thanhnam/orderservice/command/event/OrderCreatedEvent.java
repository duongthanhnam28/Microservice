package com.thanhnam.orderservice.command.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreatedEvent {
    private Integer orderId;
    private Integer userId;
    private Long total;
    private Integer status;
    private LocalDate createdDate;
}
