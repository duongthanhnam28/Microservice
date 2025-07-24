package com.thanhnam.productservice.command.controller;

import com.thanhnam.productservice.command.data.Danhmuc;
import com.thanhnam.productservice.command.command.danhmuc.CreateDanhmucCommand;
import com.thanhnam.productservice.command.command.danhmuc.UpdateDanhmucCommand;
import com.thanhnam.productservice.command.command.danhmuc.DeleteDanhmucCommand;
import com.thanhnam.productservice.command.service.DanhmucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:8000"}, maxAge = 3600)
public class DanhmucController {
    @Autowired
    private DanhmucService danhmucService;

    @PostMapping
    public Danhmuc create(@RequestBody CreateDanhmucCommand command) {
        return danhmucService.createDanhmuc(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Danhmuc> update(@PathVariable("id") Integer id, @RequestBody CreateDanhmucCommand command) {
        UpdateDanhmucCommand updateCommand = new UpdateDanhmucCommand(id, command.getTenDanhMuc());
        try {
            return ResponseEntity.ok(danhmucService.updateDanhmuc(updateCommand));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        try {
            danhmucService.deleteDanhmuc(new DeleteDanhmucCommand(id));
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 