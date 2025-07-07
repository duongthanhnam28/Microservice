package com.thanhnam.productservice.command.data;

import jakarta.persistence.*;

@Entity
@Table(name = "HANGSANXUAT")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaHang")
    private Integer maHang;

    @Column(name = "TenHang", length = 20)
    private String tenHang;

    // Constructors
    public Brand() {}

    public Brand(String tenHang) {
        this.tenHang = tenHang;
    }

    // Getters and Setters
    public Integer getMaHang() {
        return maHang;
    }

    public void setMaHang(Integer maHang) {
        this.maHang = maHang;
    }

    public String getTenHang() {
        return tenHang;
    }

    public void setTenHang(String tenHang) {
        this.tenHang = tenHang;
    }
}