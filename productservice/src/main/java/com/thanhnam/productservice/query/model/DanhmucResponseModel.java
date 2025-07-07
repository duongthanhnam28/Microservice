package com.thanhnam.productservice.query.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DanhmucResponseModel {
    private Integer maDanhMuc;
    private String tenDanhMuc;
}