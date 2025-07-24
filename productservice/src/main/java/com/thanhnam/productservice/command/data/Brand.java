package com.thanhnam.productservice.command.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "HANGSANXUAT")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaHang")
    private Integer maHang;

    @Column(name = "TenHang", length = 20)
    private String tenHang;

    @OneToMany(mappedBy = "maHang")
    private List<Product> products;
}