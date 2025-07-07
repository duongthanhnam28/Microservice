package com.thanhnam.productservice.command.command.brand;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBrandCommand {
    private Integer maHang;
    private String tenHang;
}
