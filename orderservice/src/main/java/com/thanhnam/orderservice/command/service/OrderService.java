// FIXED OrderService.java - Chỉ dùng user thực từ account service
package com.thanhnam.orderservice.command.service;

import com.thanhnam.orderservice.command.data.Order;
import com.thanhnam.orderservice.command.data.OrderRepository;
import com.thanhnam.orderservice.command.data.OrderDetail;
import com.thanhnam.orderservice.command.data.OrderDetailRepository;
import com.thanhnam.orderservice.command.model.CreateOrderRequest;
import com.thanhnam.orderservice.client.clients.AccountServiceClient;
import com.thanhnam.orderservice.client.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final AccountServiceClient accountServiceClient;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        try {
            log.info("Creating order for user: {}", request.getUserId());

            if (request.getUserId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }

            // FIXED: Chỉ kiểm tra user thực từ account service
            if (!userExistsInAccountService(request.getUserId().longValue())) {
                throw new IllegalArgumentException("User ID " + request.getUserId() + " does not exist in account service");
            }

            if (request.getItems() == null || request.getItems().isEmpty()) {
                throw new IllegalArgumentException("Order must contain at least one product");
            }

            // Tạo order
            Order order = new Order();
            order.setUserId(request.getUserId());
            order.setTotal(request.getTotal());
            order.setStatus(1); // PENDING
            order.setCreatedDate(LocalDate.now());
            Order savedOrder = orderRepository.save(order);

            log.info("Order created with ID: {}", savedOrder.getOrderId());

            // Tạo order details
            for (CreateOrderRequest.OrderItem item : request.getItems()) {
                OrderDetail detail = OrderDetail.builder()
                        .orderId(savedOrder.getOrderId())
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .build();
                orderDetailRepository.save(detail);
            }

            return savedOrder;

        } catch (Exception e) {
            log.error("Error creating order: ", e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    // FIXED: Chỉ kiểm tra user từ account service thực tế
    private boolean userExistsInAccountService(Long userId) {
        try {
            log.info("Checking user existence in account service: {}", userId);

            ApiResponse<Boolean> response = accountServiceClient.checkUserExists(userId);

            if (response == null) {
                log.error("Account service returned null response for user: {}", userId);
                throw new RuntimeException("Account service is not available");
            }

            if (response.getResult() == null) {
                log.error("Account service returned null result for user: {}", userId);
                throw new RuntimeException("Invalid response from account service");
            }

            boolean exists = response.getResult();
            log.info("User {} exists in account service: {}", userId, exists);

            return exists;

        } catch (Exception e) {
            log.error("Error checking user existence in account service for user {}: {}", userId, e.getMessage());
            // KHÔNG dùng fallback - ném lỗi để user biết
            throw new RuntimeException("Unable to verify user existence: " + e.getMessage());
        }
    }

    @Transactional
    public void updateOrderStatus(Integer orderId, Integer status) {
        try {
            log.info("Updating order {} status to {}", orderId, status);

            if (orderId == null || status == null) {
                throw new IllegalArgumentException("Order ID and status cannot be null");
            }

            if (status < 0 || status > 3) {
                throw new IllegalArgumentException("Invalid status: " + status);
            }

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

            order.setStatus(status);
            orderRepository.save(order);

            log.info("Order {} status updated to {}", orderId, status);

        } catch (Exception e) {
            log.error("Error updating order status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update order status: " + e.getMessage());
        }
    }

    @Transactional
    public void cancelOrder(Integer orderId) {
        try {
            log.info("Cancelling order: {}", orderId);

            if (orderId == null) {
                throw new IllegalArgumentException("Order ID cannot be null");
            }

            if (!orderRepository.existsById(orderId)) {
                throw new IllegalArgumentException("Order with ID " + orderId + " does not exist");
            }

            // Xóa order details trước
            orderDetailRepository.findByOrderId(orderId)
                    .forEach(orderDetailRepository::delete);

            // Xóa order
            orderRepository.deleteById(orderId);
            log.info("Order {} cancelled successfully", orderId);

        } catch (Exception e) {
            log.error("Error cancelling order {}: {}", orderId, e.getMessage(), e);
            throw new RuntimeException("Failed to cancel order: " + e.getMessage(), e);
        }
    }

    public Long getOrderCountByStatus(Integer status) {
        try {
            return orderRepository.countByStatus(status);
        } catch (Exception e) {
            log.error("Error getting order count by status {}: {}", status, e.getMessage());
            return 0L;
        }
    }
}