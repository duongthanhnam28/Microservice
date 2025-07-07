package com.thanhnam.productservice.command.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestModel {
    private String tenSP;
    private String moTa;
    private String anh1;
    private String anh2;
    private String anh3;
    private String anh4;
    private String anh5;
    private String anh6;
    private Integer soLuongTrongKho;
    private Long giaTien;
    private Integer maHang;
    private Integer maDanhMuc;
}