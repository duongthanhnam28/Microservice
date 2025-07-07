package com.thanhnam.orderservice.command.service;

import com.thanhnam.orderservice.command.data.Order;
import com.thanhnam.orderservice.command.data.OrderRepository;
import com.thanhnam.orderservice.command.data.OrderDetail;
import com.thanhnam.orderservice.command.data.OrderDetailRepository;
import com.thanhnam.orderservice.command.model.CreateOrderRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        try {
            log.info("Creating order for user: {}", request.getUserId());

            // Validate request
            if (request.getUserId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }

            // Validate userId exists in TAIKHOAN table
            if (!userExists(request.getUserId())) {
                throw new IllegalArgumentException("User ID " + request.getUserId() + " does not exist in TAIKHOAN table");
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
            if (request.getItems() != null && !request.getItems().isEmpty()) {
                for (CreateOrderRequest.OrderItem item : request.getItems()) {
                    OrderDetail detail = OrderDetail.builder()
                            .orderId(savedOrder.getOrderId())
                            .productId(item.getProductId())
                            .quantity(item.getQuantity())
                            .build();
                    orderDetailRepository.save(detail);
                    log.info("Saved order detail: Product {}, Quantity {}", item.getProductId(), item.getQuantity());
                }
            }

            log.info("Order creation completed successfully");
            return savedOrder;

        } catch (Exception e) {
            log.error("Error creating order: ", e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    private boolean userExists(Integer userId) {
        try {
            String sql = "SELECT COUNT(*) FROM TAIKHOAN WHERE MaTaiKhoan = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);
            boolean exists = count != null && count > 0;
            log.info("User {} exists: {}", userId, exists);
            return exists;
        } catch (Exception e) {
            log.error("Error checking user existence: ", e);
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
}