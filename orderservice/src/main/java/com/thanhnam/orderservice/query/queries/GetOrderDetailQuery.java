package com.thanhnam.orderservice.query.queries;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetOrderDetailQuery {
    private String orderId;
}
