package com.thanhnam.orderservice.command.model;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Integer userId;
    private List<OrderItem> items;
    private Long total;

    @Data
    public static class OrderItem {
        private Integer productId;
        private int quantity;
    }
} 