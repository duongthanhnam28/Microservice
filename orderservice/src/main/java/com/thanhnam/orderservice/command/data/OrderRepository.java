// UPDATED OrderRepository.java - Thêm query methods
package com.thanhnam.orderservice.command.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Đếm số đơn hàng theo trạng thái
    long countByStatus(Integer status);

    // Lấy đơn hàng theo userId
    List<Order> findByUserId(Integer userId);

    // Lấy đơn hàng theo ngày tạo
    List<Order> findByCreatedDate(LocalDate createdDate);

    // Lấy đơn hàng theo trạng thái
    List<Order> findByStatus(Integer status);

    // Lấy đơn hàng theo khoảng ngày
    @Query("SELECT o FROM Order o WHERE o.createdDate BETWEEN :startDate AND :endDate")
    List<Order> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Tính tổng doanh thu theo trạng thái đã giao (status = 3)
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status = 3")
    Long getTotalDeliveredRevenue();

    // Tính tổng doanh thu theo ngày đã giao
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status = 3 AND o.createdDate = :date")
    Long getDeliveredRevenueByDate(@Param("date") LocalDate date);
}