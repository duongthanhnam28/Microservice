package com.thanhnam.productservice.command.command.danhmuc;

public class CreateDanhmucCommand {
    private String tenDanhMuc;

    public CreateDanhmucCommand() {}

    public CreateDanhmucCommand(String tenDanhMuc) {
        this.tenDanhMuc = tenDanhMuc;
    }

    public String getTenDanhMuc() {
        return tenDanhMuc;
    }

    public void setTenDanhMuc(String tenDanhMuc) {
        this.tenDanhMuc = tenDanhMuc;
    }
} 