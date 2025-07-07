package com.thanhnam.orderservice.command.data;

import jakarta.persistence.*;
import lombok.*;

@Entity
@IdClass(OrderDetailId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "CHITIETDONHANG")
public class OrderDetail {
    @Id
    @Column(name = "MaDonHang")
    private Integer orderId;
    @Id
    @Column(name = "MaSP")
    private Integer productId;
    @Column(name = "SoLuongMua")
    private Integer quantity;
} 