package com.thanhnam.productservice.command.data;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SANPHAM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maSP;
    private String tenSP;
    private String moTa;
    private String anh1;
    private String anh2;
    private String anh3;
    private String anh4;
    private String anh5;
    private String anh6;
    private Integer soLuongDaBan;
    private Integer soLuongTrongKho;
    private Long giaTien;
    private Integer maHang;
    private Integer maDanhMuc;
}
