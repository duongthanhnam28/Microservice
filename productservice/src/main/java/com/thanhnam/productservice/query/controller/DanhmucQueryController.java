package com.thanhnam.productservice.query.controller;

import com.thanhnam.productservice.command.data.Danhmuc;
import com.thanhnam.productservice.command.data.DanhmucRepository;
import com.thanhnam.productservice.query.model.DanhmucResponseModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/categories")
public class DanhmucQueryController {
    private final DanhmucRepository danhmucRepository;

    public DanhmucQueryController(DanhmucRepository danhmucRepository) {
        this.danhmucRepository = danhmucRepository;
    }

    @GetMapping
    public List<DanhmucResponseModel> getAllCategories() {
        return danhmucRepository.findAll().stream().map(this::toResponseModel).collect(Collectors.toList());
    }

    @GetMapping("/{maDanhMuc}")
    public ResponseEntity<DanhmucResponseModel> getCategoryById(@PathVariable("maDanhMuc") Integer maDanhMuc) {
        Optional<Danhmuc> danhmucOpt = danhmucRepository.findById(maDanhMuc);
        return danhmucOpt.map(danhmuc -> ResponseEntity.ok(toResponseModel(danhmuc)))
                .orElse(ResponseEntity.notFound().build());
    }

    private DanhmucResponseModel toResponseModel(Danhmuc danhmuc) {
        return DanhmucResponseModel.builder()
                .maDanhMuc(danhmuc.getMaDanhMuc())
                .tenDanhMuc(danhmuc.getTenDanhMuc())
                .build();
    }
}