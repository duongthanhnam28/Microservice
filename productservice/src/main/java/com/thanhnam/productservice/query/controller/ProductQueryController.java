package com.thanhnam.productservice.query.controller;

import com.thanhnam.productservice.command.data.Product;
import com.thanhnam.productservice.command.data.ProductRepository;
import com.thanhnam.productservice.query.model.ProductResponseModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:8000"})
@RestController
@RequestMapping("/api/v1/products")
public class ProductQueryController {
    private final ProductRepository productRepository;

    public ProductQueryController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<ProductResponseModel> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponseModel).collect(Collectors.toList());
    }

    @GetMapping("/{maSP}")
    public ResponseEntity<ProductResponseModel> getProductById(@PathVariable("maSP") Integer maSP) {
        Optional<Product> productOpt = productRepository.findById(maSP);
        return productOpt.map(product -> ResponseEntity.ok(toResponseModel(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    private ProductResponseModel toResponseModel(Product product) {
        return ProductResponseModel.builder()
                .maSP(product.getMaSP())
                .tenSP(product.getTenSP())
                .moTa(product.getMoTa())
                .anh1(product.getAnh1())
                .anh2(product.getAnh2())
                .anh3(product.getAnh3())
                .anh4(product.getAnh4())
                .anh5(product.getAnh5())
                .anh6(product.getAnh6())
                .soLuongDaBan(product.getSoLuongDaBan())
                .soLuongTrongKho(product.getSoLuongTrongKho())
                .giaTien(product.getGiaTien())
                .maHang(product.getMaHang())
                .maDanhMuc(product.getMaDanhMuc())
                .build();
    }
}
