package com.thanhnam.orderservice.command.model;

import lombok.Data;
 
@Data
public class UpdateOrderStatusRequest {
    private Integer status;
} 