package com.thanhnam.productservice.query.projection;

import com.thanhnam.productservice.command.data.Product;
import com.thanhnam.productservice.command.data.ProductRepository;
import com.thanhnam.productservice.query.model.ProductResponseModel;
import org.springframework.stereotype.Service;

@Service
public class ProductProjection {
    private final ProductRepository productRepository;

    public ProductProjection(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponseModel getProductById(Integer maSP) {
        Product product = productRepository.findById(maSP)
                .orElseThrow(() -> new RuntimeException("Product not found"));
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