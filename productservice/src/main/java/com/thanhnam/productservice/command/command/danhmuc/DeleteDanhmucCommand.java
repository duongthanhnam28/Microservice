package com.thanhnam.productservice.command.command.danhmuc;

public class DeleteDanhmucCommand {
    private Integer maDanhMuc;

    public DeleteDanhmucCommand() {}

    public DeleteDanhmucCommand(Integer maDanhMuc) {
        this.maDanhMuc = maDanhMuc;
    }

    public Integer getMaDanhMuc() {
        return maDanhMuc;
    }

    public void setMaDanhMuc(Integer maDanhMuc) {
        this.maDanhMuc = maDanhMuc;
    }
} 