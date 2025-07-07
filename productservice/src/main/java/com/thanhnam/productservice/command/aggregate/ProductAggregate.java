package com.thanhnam.productservice.command.aggregate;

import com.thanhnam.productservice.command.command.CreateProductCommand;
import com.thanhnam.productservice.command.command.UpdateProductCommand;
import com.thanhnam.productservice.command.command.DeleteProductCommand;
import com.thanhnam.productservice.command.data.Product;
import com.thanhnam.productservice.command.event.ProductCreatedEvent;
import com.thanhnam.productservice.command.event.ProductUpdatedEvent;
import com.thanhnam.productservice.command.event.ProductDeletedEvent;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ProductAggregate {
    private Integer maSP;
    private String tenSP;
    private String moTa;
    private String anh1;
    private String anh2;
    private String anh3;
    private String anh4;
    private String anh5;
    private String anh6;
    private Integer soLuongDaBan;
    private Integer soLuongTrongKho;
    private Long giaTien;
    private Integer maHang;
    private Integer maDanhMuc;

    // Command Handlers
    public ProductCreatedEvent handle(CreateProductCommand command) {
        ProductCreatedEvent event = new ProductCreatedEvent();
        event.setTenSP(command.getTenSP());
        event.setMoTa(command.getMoTa());
        event.setAnh1(command.getAnh1());
        event.setAnh2(command.getAnh2());
        event.setAnh3(command.getAnh3());
        event.setAnh4(command.getAnh4());
        event.setAnh5(command.getAnh5());
        event.setAnh6(command.getAnh6());
        event.setSoLuongDaBan(command.getSoLuongDaBan());
        event.setSoLuongTrongKho(command.getSoLuongTrongKho());
        event.setGiaTien(command.getGiaTien());
        event.setMaHang(command.getMaHang());
        event.setMaDanhMuc(command.getMaDanhMuc());
        
        // Update aggregate state
        this.tenSP = event.getTenSP();
        this.moTa = event.getMoTa();
        this.anh1 = event.getAnh1();
        this.anh2 = event.getAnh2();
        this.anh3 = event.getAnh3();
        this.anh4 = event.getAnh4();
        this.anh5 = event.getAnh5();
        this.anh6 = event.getAnh6();
        this.soLuongDaBan = event.getSoLuongDaBan();
        this.soLuongTrongKho = event.getSoLuongTrongKho();
        this.giaTien = event.getGiaTien();
        this.maHang = event.getMaHang();
        this.maDanhMuc = event.getMaDanhMuc();
        
        return event;
    }

    public ProductUpdatedEvent handle(UpdateProductCommand command) {
        ProductUpdatedEvent event = new ProductUpdatedEvent();
        event.setMaSP(command.getMaSP());
        event.setTenSP(command.getTenSP());
        event.setMoTa(command.getMoTa());
        event.setAnh1(command.getAnh1());
        event.setAnh2(command.getAnh2());
        event.setAnh3(command.getAnh3());
        event.setAnh4(command.getAnh4());
        event.setAnh5(command.getAnh5());
        event.setAnh6(command.getAnh6());
        event.setSoLuongDaBan(command.getSoLuongDaBan());
        event.setSoLuongTrongKho(command.getSoLuongTrongKho());
        event.setGiaTien(command.getGiaTien());
        event.setMaHang(command.getMaHang());
        event.setMaDanhMuc(command.getMaDanhMuc());
        
        // Update aggregate state
        this.maSP = event.getMaSP();
        this.tenSP = event.getTenSP();
        this.moTa = event.getMoTa();
        this.anh1 = event.getAnh1();
        this.anh2 = event.getAnh2();
        this.anh3 = event.getAnh3();
        this.anh4 = event.getAnh4();
        this.anh5 = event.getAnh5();
        this.anh6 = event.getAnh6();
        this.soLuongDaBan = event.getSoLuongDaBan();
        this.soLuongTrongKho = event.getSoLuongTrongKho();
        this.giaTien = event.getGiaTien();
        this.maHang = event.getMaHang();
        this.maDanhMuc = event.getMaDanhMuc();
        
        return event;
    }

    public ProductDeletedEvent handle(DeleteProductCommand command) {
        ProductDeletedEvent event = new ProductDeletedEvent();
        event.setMaSP(command.getMaSP());
        
        // Update aggregate state
        this.maSP = event.getMaSP();
        
        return event;
    }

    // Event Sourcing Handlers
    public void on(ProductCreatedEvent event) {
        this.tenSP = event.getTenSP();
        this.moTa = event.getMoTa();
        this.anh1 = event.getAnh1();
        this.anh2 = event.getAnh2();
        this.anh3 = event.getAnh3();
        this.anh4 = event.getAnh4();
        this.anh5 = event.getAnh5();
        this.anh6 = event.getAnh6();
        this.soLuongDaBan = event.getSoLuongDaBan();
        this.soLuongTrongKho = event.getSoLuongTrongKho();
        this.giaTien = event.getGiaTien();
        this.maHang = event.getMaHang();
        this.maDanhMuc = event.getMaDanhMuc();
    }

    public void on(ProductUpdatedEvent event) {
        this.maSP = event.getMaSP();
        this.tenSP = event.getTenSP();
        this.moTa = event.getMoTa();
        this.anh1 = event.getAnh1();
        this.anh2 = event.getAnh2();
        this.anh3 = event.getAnh3();
        this.anh4 = event.getAnh4();
        this.anh5 = event.getAnh5();
        this.anh6 = event.getAnh6();
        this.soLuongDaBan = event.getSoLuongDaBan();
        this.soLuongTrongKho = event.getSoLuongTrongKho();
        this.giaTien = event.getGiaTien();
        this.maHang = event.getMaHang();
        this.maDanhMuc = event.getMaDanhMuc();
    }

    public void on(ProductDeletedEvent event) {
        this.maSP = event.getMaSP();
    }

    // Business logic methods
    public boolean isInStock() {
        return this.soLuongTrongKho != null && this.soLuongTrongKho > 0;
    }
    
    public boolean isOutOfStock() {
        return this.soLuongTrongKho != null && this.soLuongTrongKho == 0;
    }
    
    public boolean hasLowStock(int threshold) {
        return this.soLuongTrongKho != null && this.soLuongTrongKho <= threshold;
    }

    // Convert to Product entity
    public Product toProduct() {
        return Product.builder()
                .maSP(this.maSP)
                .tenSP(this.tenSP)
                .moTa(this.moTa)
                .anh1(this.anh1)
                .anh2(this.anh2)
                .anh3(this.anh3)
                .anh4(this.anh4)
                .anh5(this.anh5)
                .anh6(this.anh6)
                .soLuongDaBan(this.soLuongDaBan)
                .soLuongTrongKho(this.soLuongTrongKho)
                .giaTien(this.giaTien)
                .maHang(this.maHang)
                .maDanhMuc(this.maDanhMuc)
                .build();
    }

    // Create from Product entity
    public static ProductAggregate fromProduct(Product product) {
        ProductAggregate aggregate = new ProductAggregate();
        aggregate.setMaSP(product.getMaSP());
        aggregate.setTenSP(product.getTenSP());
        aggregate.setMoTa(product.getMoTa());
        aggregate.setAnh1(product.getAnh1());
        aggregate.setAnh2(product.getAnh2());
        aggregate.setAnh3(product.getAnh3());
        aggregate.setAnh4(product.getAnh4());
        aggregate.setAnh5(product.getAnh5());
        aggregate.setAnh6(product.getAnh6());
        aggregate.setSoLuongDaBan(product.getSoLuongDaBan());
        aggregate.setSoLuongTrongKho(product.getSoLuongTrongKho());
        aggregate.setGiaTien(product.getGiaTien());
        aggregate.setMaHang(product.getMaHang());
        aggregate.setMaDanhMuc(product.getMaDanhMuc());
        return aggregate;
    }
}
