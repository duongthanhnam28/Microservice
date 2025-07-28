// FIXED OrderService.java - Xóa bỏ demo users, chỉ dùng dữ liệu thực từ account service
package com.thanhnam.orderservice.command.service;

import com.thanhnam.orderservice.command.data.Order;
import com.thanhnam.orderservice.command.data.OrderRepository;
import com.thanhnam.orderservice.command.data.OrderDetail;
import com.thanhnam.orderservice.command.data.OrderDetailRepository;
import com.thanhnam.orderservice.command.model.CreateOrderRequest;
import com.thanhnam.orderservice.client.clients.AccountServiceClient;
import com.thanhnam.orderservice.client.clients.ProductServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import com.thanhnam.orderservice.client.dto.ApiResponse;
import java.util.List;

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

            if (request.getUserId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }

            // FIXED: Chỉ kiểm tra user thực, không dùng demo users
            if (!userExistsInDatabase(request.getUserId().longValue())) {
                throw new IllegalArgumentException("User ID " + request.getUserId() + " does not exist in system");
            }

            if (request.getItems() == null || request.getItems().isEmpty()) {
                throw new IllegalArgumentException("Order must contain at least one product");
            }

            Order order = new Order();
            order.setUserId(request.getUserId());
            order.setTotal(request.getTotal());
            order.setStatus(1); // PENDING
            order.setCreatedDate(LocalDate.now());
            Order savedOrder = orderRepository.save(order);

            log.info("Order created with ID: {}", savedOrder.getOrderId());

            for (CreateOrderRequest.OrderItem item : request.getItems()) {
                OrderDetail detail = OrderDetail.builder()
                        .orderId(savedOrder.getOrderId())
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .build();
                orderDetailRepository.save(detail);
                log.info("Saved order detail: Product {}, Quantity {}", item.getProductId(), item.getQuantity());
            }

            return savedOrder;

        } catch (Exception e) {
            log.error("Error creating order: ", e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
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

            Integer oldStatus = order.getStatus();

            if (oldStatus != null && oldStatus.equals(status)) {
                log.info("Order {} already has status {}", orderId, status);
                return;
            }

            order.setStatus(status);
            orderRepository.save(order);

            if (status == 3 && (oldStatus == null || oldStatus != 3)) {
                updateRevenue(order);
                log.info("Revenue updated for delivered order: {}", orderId);
            }

            log.info("Order {} status updated: {} -> {}", orderId, oldStatus, status);

        } catch (Exception e) {
            log.error("Error updating order status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update order status: " + e.getMessage());
        }
    }

    private void updateRevenue(Order order) {
        try {
            log.info("Updating revenue for delivered order: {}", order.getOrderId());

            LocalDate deliveryDate = LocalDate.now();

            String updateRevenueSql = """
                INSERT INTO DOANHTHU (Ngay, TongDoanhThu, SoDonHang, NguoiCapNhat) 
                VALUES (?, ?, 1, 'SYSTEM')
                ON DUPLICATE KEY UPDATE 
                    TongDoanhThu = TongDoanhThu + VALUES(TongDoanhThu),
                    SoDonHang = SoDonHang + 1,
                    NgayCapNhat = NOW()
                """;

            int rowsUpdated = jdbcTemplate.update(updateRevenueSql,
                    deliveryDate,
                    order.getTotal()
            );

            if (rowsUpdated > 0) {
                log.info("Revenue updated successfully for order {}: +{} VND",
                        order.getOrderId(), order.getTotal());
            }

            String updateTotalRevenueSql = """
                INSERT INTO THONGKE (LoaiThongKe, GiaTri, NgayCapNhat) 
                VALUES ('TOTAL_REVENUE', ?, NOW())
                ON DUPLICATE KEY UPDATE 
                    GiaTri = GiaTri + VALUES(GiaTri),
                    NgayCapNhat = NOW()
                """;

            jdbcTemplate.update(updateTotalRevenueSql, order.getTotal());

            log.info("Total revenue statistics updated for order: {}", order.getOrderId());

        } catch (Exception e) {
            log.error("Error updating revenue for order {}: {}", order.getOrderId(), e.getMessage());
        }
    }

    public Long getTotalRevenue() {
        try {
            String sql = "SELECT COALESCE(SUM(GiaTri), 0) FROM THONGKE WHERE LoaiThongKe = 'TOTAL_REVENUE'";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } catch (Exception e) {
            log.error("Error getting total revenue: {}", e.getMessage());
            return 0L;
        }
    }

    public Long getRevenueByDate(LocalDate date) {
        try {
            String sql = "SELECT COALESCE(TongDoanhThu, 0) FROM DOANHTHU WHERE Ngay = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, date);
        } catch (Exception e) {
            log.error("Error getting revenue by date {}: {}", date, e.getMessage());
            return 0L;
        }
    }

    public Integer getOrderCountByStatus(Integer status) {
        try {
            return Math.toIntExact(orderRepository.countByStatus(status));
        } catch (Exception e) {
            log.error("Error getting order count by status {}: {}", status, e.getMessage());
            return 0;
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

            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderId);
            if (!orderDetails.isEmpty()) {
                orderDetailRepository.deleteAll(orderDetails);
                log.info("Deleted {} order details for order {}", orderDetails.size(), orderId);
            }

            orderRepository.deleteById(orderId);
            log.info("Order {} cancelled successfully", orderId);

        } catch (Exception e) {
            log.error("Error cancelling order {}: {}", orderId, e.getMessage(), e);
            throw new RuntimeException("Failed to cancel order: " + e.getMessage(), e);
        }
    }

    // FIXED: Chỉ kiểm tra user thực từ account service, bỏ hết demo users
    private boolean userExistsInDatabase(Long userId) {
        try {
            log.info("Checking if user exists in database with ID: {}", userId);

            ApiResponse<Boolean> response = accountServiceClient.checkUserExists(userId);

            if (response == null) {
                log.error("Null response from account-service for user ID: {}", userId);
                return false;
            }

            Boolean exists = response.getResult();
            if (exists == null) {
                log.error("Null result from account-service for user ID: {}", userId);
                return false;
            }

            log.info("User existence check for ID {}: {}", userId, exists);
            return exists;

        } catch (Exception e) {
            log.error("Error checking user ID {}: {}", userId, e.getMessage(), e);
            // KHÔNG fallback về demo users, trả về false nếu lỗi
            return false;
        }
    }
}