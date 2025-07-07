package com.thanhnam.productservice.query.controller;

import com.thanhnam.productservice.command.data.Brand;
import com.thanhnam.productservice.command.data.BrandRepository;
import com.thanhnam.productservice.query.model.BrandResponseModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/brands")
public class BrandQueryController {
    private final BrandRepository brandRepository;

    public BrandQueryController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public List<BrandResponseModel> getAllBrands() {
        return brandRepository.findAll().stream().map(this::toResponseModel).collect(Collectors.toList());
    }

    @GetMapping("/{maHang}")
    public ResponseEntity<BrandResponseModel> getBrandById(@PathVariable("maHang") Integer maHang) {
        Optional<Brand> brandOpt = brandRepository.findById(maHang);
        return brandOpt.map(brand -> ResponseEntity.ok(toResponseModel(brand)))
                .orElse(ResponseEntity.notFound().build());
    }

    private BrandResponseModel toResponseModel(Brand brand) {
        return BrandResponseModel.builder()
                .maHang(brand.getMaHang())
                .tenHang(brand.getTenHang())
                .build();
    }
}