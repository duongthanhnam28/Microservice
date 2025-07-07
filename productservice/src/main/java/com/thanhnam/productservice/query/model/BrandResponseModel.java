package com.thanhnam.productservice.query.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BrandResponseModel {
    private Integer maHang;
    private String tenHang;
}