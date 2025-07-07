package com.thanhnam.productservice.command.event;

import com.thanhnam.productservice.command.data.Product;
import com.thanhnam.productservice.command.data.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductEventService {
    private final ProductRepository productRepository;

    public ProductEventService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void handleProductCreated(ProductCreatedEvent event) {
        Product product = Product.builder()
                .tenSP(event.getTenSP())
                .moTa(event.getMoTa())
                .anh1(event.getAnh1())
                .anh2(event.getAnh2())
                .anh3(event.getAnh3())
                .anh4(event.getAnh4())
                .anh5(event.getAnh5())
                .anh6(event.getAnh6())
                .soLuongDaBan(event.getSoLuongDaBan())
                .soLuongTrongKho(event.getSoLuongTrongKho())
                .giaTien(event.getGiaTien())
                .maHang(event.getMaHang())
                .maDanhMuc(event.getMaDanhMuc())
                .build();
        productRepository.save(product);
        // TODO: Phát Kafka hoặc xử lý nghiệp vụ khác nếu cần
    }

    public void handleProductUpdated(ProductUpdatedEvent event) {
        Product product = productRepository.findById(event.getMaSP()).orElse(null);
        if (product != null) {
            product.setTenSP(event.getTenSP());
            product.setMoTa(event.getMoTa());
            product.setAnh1(event.getAnh1());
            product.setAnh2(event.getAnh2());
            product.setAnh3(event.getAnh3());
            product.setAnh4(event.getAnh4());
            product.setAnh5(event.getAnh5());
            product.setAnh6(event.getAnh6());
            product.setSoLuongDaBan(event.getSoLuongDaBan());
            product.setSoLuongTrongKho(event.getSoLuongTrongKho());
            product.setGiaTien(event.getGiaTien());
            product.setMaHang(event.getMaHang());
            product.setMaDanhMuc(event.getMaDanhMuc());
            productRepository.save(product);
            // TODO: Phát Kafka hoặc xử lý nghiệp vụ khác nếu cần
        }
    }

    public void handleProductDeleted(ProductDeletedEvent event) {
        productRepository.deleteById(event.getMaSP());
        // TODO: Phát Kafka hoặc xử lý nghiệp vụ khác nếu cần
    }
}
