package com.thanhnam.userservice.query.model;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseModel {
    private Integer maTaiKhoan;
    private String ten;
    private LocalDate ngaySinh;
    private String sdt;
    private String diaChi;
    private String email;
    private String matKhau;
    private Integer maCV;
} 