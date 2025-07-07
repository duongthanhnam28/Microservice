package com.thanhnam.orderservice.query.controller;

import com.thanhnam.orderservice.command.data.Order;
import com.thanhnam.orderservice.command.data.OrderDetail;
import com.thanhnam.orderservice.command.data.OrderRepository;
import com.thanhnam.orderservice.command.data.OrderDetailRepository;
import com.thanhnam.orderservice.query.model.OrderResponseModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class OrderQueryController {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @GetMapping
    public List<OrderResponseModel> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> toResponseModel(order, orderDetailRepository.findAll().stream()
                        .filter(d -> d.getOrderId().equals(order.getOrderId()))
                        .collect(Collectors.toList())))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseModel> getOrderById(@PathVariable Integer id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();
        List<OrderDetail> details = orderDetailRepository.findAll().stream()
                .filter(d -> d.getOrderId().equals(id))
                .collect(Collectors.toList());
        return ResponseEntity.ok(toResponseModel(orderOpt.get(), details));
    }

    private OrderResponseModel toResponseModel(Order order, List<OrderDetail> details) {
        OrderResponseModel resp = new OrderResponseModel();
        resp.setOrderId(order.getOrderId());
        resp.setUserId(order.getUserId());
        resp.setTotal(order.getTotal());
        resp.setStatus(order.getStatus());
        resp.setCreatedDate(order.getCreatedDate());
        resp.setItems(details.stream().map(d -> new OrderResponseModel.OrderItem(d.getProductId(), d.getQuantity())).collect(Collectors.toList()));
        return resp;
    }
}
