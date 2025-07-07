package com.thanhnam.productservice.command.service;

import com.thanhnam.productservice.command.data.Danhmuc;
import com.thanhnam.productservice.command.data.DanhmucRepository;
import com.thanhnam.productservice.command.command.danhmuc.CreateDanhmucCommand;
import com.thanhnam.productservice.command.command.danhmuc.UpdateDanhmucCommand;
import com.thanhnam.productservice.command.command.danhmuc.DeleteDanhmucCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DanhmucService {
    @Autowired
    private DanhmucRepository danhmucRepository;

    public List<Danhmuc> getAllDanhmuc() {
        return danhmucRepository.findAll();
    }

    public Optional<Danhmuc> getDanhmucById(Integer maDanhMuc) {
        return danhmucRepository.findById(maDanhMuc);
    }

    public Danhmuc createDanhmuc(CreateDanhmucCommand command) {
        Danhmuc danhmuc = new Danhmuc();
        danhmuc.setTenDanhMuc(command.getTenDanhMuc());
        return danhmucRepository.save(danhmuc);
    }

    public Danhmuc updateDanhmuc(UpdateDanhmucCommand command) {
        Optional<Danhmuc> optional = danhmucRepository.findById(command.getMaDanhMuc());
        if (optional.isPresent()) {
            Danhmuc danhmuc = optional.get();
            danhmuc.setTenDanhMuc(command.getTenDanhMuc());
            return danhmucRepository.save(danhmuc);
        }
        throw new RuntimeException("Danhmuc not found");
    }

    public void deleteDanhmuc(DeleteDanhmucCommand command) {
        danhmucRepository.deleteById(command.getMaDanhMuc());
    }
} 