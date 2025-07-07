package com.thanhnam.orderservice.command.data;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "DONHANG")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaDonHang")
    private Integer orderId;

    @Column(name = "MaTaiKhoan")
    private Integer userId;

    @Column(name = "TongTien")
    private Long total;

    @Column(name = "TinhTrang")
    private Integer status;

    @Column(name = "NgayLap")
    private LocalDate createdDate;
}
