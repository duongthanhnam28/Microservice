package com.thanhnam.productservice.command.service;

import com.thanhnam.productservice.command.data.Brand;
import com.thanhnam.productservice.command.data.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Optional<Brand> getBrandById(Integer maHang) {
        return brandRepository.findById(maHang);
    }

    public Brand createBrand(String tenHang) {
        Brand brand = new Brand();
        brand.setTenHang(tenHang);
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Integer maHang, String tenHang) {
        Optional<Brand> optional = brandRepository.findById(maHang);
        if (optional.isPresent()) {
            Brand brand = optional.get();
            brand.setTenHang(tenHang);
            return brandRepository.save(brand);
        }
        throw new RuntimeException("Brand not found");
    }

    public void deleteBrand(Integer maHang) {
        brandRepository.deleteById(maHang);
    }
} 