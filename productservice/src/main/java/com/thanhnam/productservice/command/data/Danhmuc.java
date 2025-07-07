package com.thanhnam.productservice.command.data;

import jakarta.persistence.*;

@Entity
@Table(name = "DANHMUCSANPHAM")
public class Danhmuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaDanhMuc")
    private Integer maDanhMuc;

    @Column(name = "TenDanhMuc", length = 30)
    private String tenDanhMuc;

    // Constructors
    public Danhmuc() {}

    public Danhmuc(String tenDanhMuc) {
        this.tenDanhMuc = tenDanhMuc;
    }

    // Getters and Setters
    public Integer getMaDanhMuc() {
        return maDanhMuc;
    }

    public void setMaDanhMuc(Integer maDanhMuc) {
        this.maDanhMuc = maDanhMuc;
    }

    public String getTenDanhMuc() {
        return tenDanhMuc;
    }

    public void setTenDanhMuc(String tenDanhMuc) {
        this.tenDanhMuc = tenDanhMuc;
    }
}
