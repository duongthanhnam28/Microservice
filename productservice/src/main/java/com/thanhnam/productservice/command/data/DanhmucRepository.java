package com.thanhnam.productservice.command.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhmucRepository extends JpaRepository<Danhmuc, Integer> {
}