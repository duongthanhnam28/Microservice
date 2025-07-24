package com.thanhnam.orderservice.client.clients;

import com.thanhnam.orderservice.client.dto.ApiResponse;
import com.thanhnam.orderservice.client.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "account-service",url = "http://localhost:9002")
public interface AccountServiceClient {
    @GetMapping("/users/exists/{id}")
    ApiResponse<Boolean> checkUserExists(@PathVariable("id") Long id);
} 