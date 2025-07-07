package com.thanhnam.orderservice.command.controller;

import com.thanhnam.orderservice.command.model.CreateOrderRequest;
import com.thanhnam.orderservice.command.model.UpdateOrderStatusRequest;
import com.thanhnam.orderservice.command.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, maxAge = 3600)
@RequiredArgsConstructor
public class OrderCommandController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        var order = orderService.createOrder(request);
        return ResponseEntity.ok().body(order.getOrderId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer id, @RequestBody UpdateOrderStatusRequest request) {
        orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.noContent().build();
    }
}
