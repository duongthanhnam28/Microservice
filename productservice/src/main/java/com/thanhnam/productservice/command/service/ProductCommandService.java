package com.thanhnam.productservice.command.service;

import com.thanhnam.productservice.command.command.CreateProductCommand;
import com.thanhnam.productservice.command.command.UpdateProductCommand;
import com.thanhnam.productservice.command.command.DeleteProductCommand;
import com.thanhnam.productservice.command.data.Product;
import com.thanhnam.productservice.command.data.ProductRepository;
import com.thanhnam.productservice.command.event.ProductCreatedEvent;
import com.thanhnam.productservice.command.event.ProductUpdatedEvent;
import org.springframework.stereotype.Service;

@Service
public class ProductCommandService {
    private final ProductRepository productRepository;

    public ProductCommandService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductCreatedEvent createProduct(CreateProductCommand command) {
        Product product = Product.builder()
                .tenSP(command.getTenSP())
                .moTa(command.getMoTa())
                .anh1(command.getAnh1())
                .anh2(command.getAnh2())
                .anh3(command.getAnh3())
                .anh4(command.getAnh4())
                .anh5(command.getAnh5())
                .anh6(command.getAnh6())
                .soLuongDaBan(command.getSoLuongDaBan())
                .soLuongTrongKho(command.getSoLuongTrongKho())
                .giaTien(command.getGiaTien())
                .maHang(command.getMaHang())
                .maDanhMuc(command.getMaDanhMuc())
                .build();
        Product saved = productRepository.save(product);
        return new ProductCreatedEvent(
                saved.getTenSP(),
                saved.getMoTa(),
                saved.getAnh1(),
                saved.getAnh2(),
                saved.getAnh3(),
                saved.getAnh4(),
                saved.getAnh5(),
                saved.getAnh6(),
                saved.getSoLuongDaBan(),
                saved.getSoLuongTrongKho(),
                saved.getGiaTien(),
                saved.getMaHang(),
                saved.getMaDanhMuc()
        );
    }

    public ProductUpdatedEvent updateProduct(UpdateProductCommand command) {
        Product product = productRepository.findById(command.getMaSP())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setTenSP(command.getTenSP());
        product.setMoTa(command.getMoTa());
        product.setAnh1(command.getAnh1());
        product.setAnh2(command.getAnh2());
        product.setAnh3(command.getAnh3());
        product.setAnh4(command.getAnh4());
        product.setAnh5(command.getAnh5());
        product.setAnh6(command.getAnh6());
        product.setSoLuongDaBan(command.getSoLuongDaBan());
        product.setSoLuongTrongKho(command.getSoLuongTrongKho());
        product.setGiaTien(command.getGiaTien());
        product.setMaHang(command.getMaHang());
        product.setMaDanhMuc(command.getMaDanhMuc());
        Product saved = productRepository.save(product);
        return new ProductUpdatedEvent(
                saved.getMaSP(),
                saved.getTenSP(),
                saved.getMoTa(),
                saved.getAnh1(),
                saved.getAnh2(),
                saved.getAnh3(),
                saved.getAnh4(),
                saved.getAnh5(),
                saved.getAnh6(),
                saved.getSoLuongDaBan(),
                saved.getSoLuongTrongKho(),
                saved.getGiaTien(),
                saved.getMaHang(),
                saved.getMaDanhMuc()
        );
    }

    public void deleteProduct(DeleteProductCommand command) {
        productRepository.deleteById(command.getMaSP());
        // Có thể phát event ProductDeletedEvent nếu cần
    }

    public void reduceStock(Integer maSP, int quantity) {
        Product product = productRepository.findById(maSP)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        if (product.getSoLuongTrongKho() < quantity) {
            throw new RuntimeException("Not enough stock");
        }
        product.setSoLuongTrongKho(product.getSoLuongTrongKho() - quantity);
        product.setSoLuongDaBan((product.getSoLuongDaBan() == null ? 0 : product.getSoLuongDaBan()) + quantity);
        productRepository.save(product);
    }
} 