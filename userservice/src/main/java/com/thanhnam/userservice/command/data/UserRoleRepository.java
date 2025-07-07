package com.thanhnam.userservice.command.data;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
    
    List<UserRole> findByMaTaiKhoan(Integer maTaiKhoan);
    
    void deleteByMaTaiKhoanAndMaChucVu(Integer maTaiKhoan, Integer maChucVu);
} 