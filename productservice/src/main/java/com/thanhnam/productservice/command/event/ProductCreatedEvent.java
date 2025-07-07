package com.thanhnam.productservice.command.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreatedEvent {
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
