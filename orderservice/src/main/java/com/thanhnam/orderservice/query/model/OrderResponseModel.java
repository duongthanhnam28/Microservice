package com.thanhnam.orderservice.query.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseModel {
    private Integer orderId;
    private Integer userId;
    private Long total;
    private Integer status;
    private LocalDate createdDate;
    private List<OrderItem> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItem {
        private Integer productId;
        private int quantity;
    }
}
