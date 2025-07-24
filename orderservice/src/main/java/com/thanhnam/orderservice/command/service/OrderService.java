package com.thanhnam.orderservice.command.service;

import com.thanhnam.orderservice.command.data.Order;
import com.thanhnam.orderservice.command.data.OrderRepository;
import com.thanhnam.orderservice.command.data.OrderDetail;
import com.thanhnam.orderservice.command.data.OrderDetailRepository;
import com.thanhnam.orderservice.command.model.CreateOrderRequest;
import com.thanhnam.orderservice.client.clients.AccountServiceClient;
import com.thanhnam.orderservice.client.clients.ProductServiceClient;
import com.thanhnam.orderservice.client.dto.ProductResponseModel;
import com.thanhnam.orderservice.client.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import com.thanhnam.orderservice.client.dto.ApiResponse;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final JdbcTemplate jdbcTemplate;
    private final ProductServiceClient productServiceClient;
    private final AccountServiceClient accountServiceClient;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        try {
            log.info("Creating order for user: {}", request.getUserId());

            // Validate request
            if (request.getUserId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }

            // Validate userId exists via account-service using NEW endpoint
            if (!userExists(request.getUserId().longValue())) {
                throw new IllegalArgumentException("User ID " + request.getUserId() + " does not exist in account-service");
            }

            if (request.getItems() == null || request.getItems().isEmpty()) {
                throw new IllegalArgumentException("Order must contain at least one product");
            }

            // Tạo order mới
            Order order = new Order();
            order.setUserId(request.getUserId());
            order.setTotal(request.getTotal());
            order.setStatus(1); // PENDING status
            order.setCreatedDate(LocalDate.now());
            Order savedOrder = orderRepository.save(order);

            log.info("Order created with ID: {}", savedOrder.getOrderId());

            // Lưu chi tiết đơn hàng
            for (CreateOrderRequest.OrderItem item : request.getItems()) {
                OrderDetail detail = OrderDetail.builder()
                        .orderId(savedOrder.getOrderId())
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .build();
                orderDetailRepository.save(detail);
                log.info("Saved order detail: Product {}, Quantity {}", item.getProductId(), item.getQuantity());
            }

            log.info("Order creation completed successfully");
            return savedOrder;

        } catch (Exception e) {
            log.error("Error creating order: ", e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    /**
     * Kiểm tra user tồn tại sử dụng endpoint PUBLIC /users/exists/{id}
     * Không cần authentication
     */
    private boolean userExists(Long userId) {
        try {
            log.info("Checking if user exists with ID: {}", userId);

            // Sử dụng endpoint mới /users/exists/{id}
            ApiResponse<Boolean> response = accountServiceClient.checkUserExists(userId);

            if (response == null) {
                log.warn("Received null response from account-service for user ID: {}", userId);
                return false;
            }

            Boolean exists = response.getResult();
            if (exists == null) {
                log.warn("Received null result from account-service for user ID: {}", userId);
                return false;
            }

            log.info("User existence check for ID {}: {}", userId, exists);
            return exists;

        } catch (feign.FeignException.NotFound e) {
            log.warn("User with ID {} not found in account-service (404): {}", userId, e.getMessage());
            return false;

        } catch (feign.FeignException e) {
            log.error("Feign error when calling account-service for user ID {}: Status={}, Message={}",
                    userId, e.status(), e.getMessage());
            return false;

        } catch (Exception e) {
            log.error("Unexpected error when checking user ID {}: {}", userId, e.getMessage(), e);
            return false;
        }
    }

    @Transactional
    public void cancelOrder(Integer orderId) {
        try {
            log.info("Cancelling order: {}", orderId);

            // Xoá chi tiết đơn hàng
            orderDetailRepository.deleteAll(
                    orderDetailRepository.findAll().stream()
                            .filter(d -> d.getOrderId().equals(orderId))
                            .toList()
            );

            // Xoá đơn hàng
            orderRepository.deleteById(orderId);

            log.info("Order {} cancelled successfully", orderId);

        } catch (Exception e) {
            log.error("Error cancelling order: ", e);
            throw new RuntimeException("Failed to cancel order: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void updateOrderStatus(Integer orderId, Integer status) {
        try {
            log.info("Updating order {} status to {}", orderId, status);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            order.setStatus(status);
            orderRepository.save(order);

            log.info("Order {} status updated successfully", orderId);

        } catch (Exception e) {
            log.error("Error updating order status: ", e);
            throw new RuntimeException("Failed to update order status: " + e.getMessage(), e);
        }
    }

    public ProductResponseModel getProductInfo(Integer productId) {
        return productServiceClient.getProductById(productId);
    }
}