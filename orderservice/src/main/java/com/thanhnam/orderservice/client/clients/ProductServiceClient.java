package com.thanhnam.orderservice.client.clients;

import com.thanhnam.orderservice.client.dto.ProductResponseModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "productservice")
public interface ProductServiceClient {
    @GetMapping("/api/v1/products/{maSP}")
    ProductResponseModel getProductById(@PathVariable("maSP") Integer maSP);
} 