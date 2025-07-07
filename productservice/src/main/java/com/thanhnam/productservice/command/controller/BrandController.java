package com.thanhnam.productservice.command.controller;

import com.thanhnam.productservice.command.data.Brand;
import com.thanhnam.productservice.command.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/brands")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, maxAge = 3600)
public class BrandController {
    @Autowired
    private BrandService brandService;


    @PostMapping
    public Brand create(@RequestBody Brand brand) {
        return brandService.createBrand(brand.getTenHang());
    }

    @PutMapping("/{maHang}")
    public ResponseEntity<Brand> update(@PathVariable("maHang") Integer maHang, @RequestBody Brand brand) {
        try {
            return ResponseEntity.ok(brandService.updateBrand(maHang, brand.getTenHang()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{maHang}")
    public ResponseEntity<Void> delete(@PathVariable("maHang") Integer maHang) {
        try {
            brandService.deleteBrand(maHang);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 