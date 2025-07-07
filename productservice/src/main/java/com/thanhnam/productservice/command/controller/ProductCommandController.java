package com.thanhnam.productservice.command.controller;

import com.thanhnam.productservice.command.command.CreateProductCommand;
import com.thanhnam.productservice.command.command.UpdateProductCommand;
import com.thanhnam.productservice.command.command.DeleteProductCommand;
import com.thanhnam.productservice.command.service.ProductCommandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, maxAge = 3600)
public class ProductCommandController {
    private final ProductCommandService productCommandService;

    public ProductCommandController(ProductCommandService productCommandService) {
        this.productCommandService = productCommandService;
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody CreateProductCommand command) {
        return ResponseEntity.ok(productCommandService.createProduct(command));
    }

    @PutMapping("/{maSP}")
    public ResponseEntity<?> updateProduct(@PathVariable("maSP") Integer maSP, @RequestBody UpdateProductCommand command) {
        command.setMaSP(maSP);
        return ResponseEntity.ok(productCommandService.updateProduct(command));
    }

    @DeleteMapping("/{maSP}")
    public ResponseEntity<?> deleteProduct(@PathVariable("maSP") Integer maSP) {
        DeleteProductCommand command = new DeleteProductCommand(maSP);
        productCommandService.deleteProduct(command);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{maSP}/reduce-stock")
    public ResponseEntity<?> reduceStock(@PathVariable("maSP") Integer maSP, @RequestParam int quantity) {
        productCommandService.reduceStock(maSP, quantity);
        return ResponseEntity.ok().build();
    }
}
