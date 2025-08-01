package com.thanhnam.orderservice.command.data;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailId> {

    List<OrderDetail> findByOrderId(Integer orderId);
}