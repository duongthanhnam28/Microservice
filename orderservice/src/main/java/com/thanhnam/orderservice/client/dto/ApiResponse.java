package com.thanhnam.orderservice.client.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private T result;
    private String message;
    private String timestamp;
} 