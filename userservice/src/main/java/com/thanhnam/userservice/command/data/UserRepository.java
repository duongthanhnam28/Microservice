package com.thanhnam.userservice.command.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByEmail(String email);

    User findByEmail(String email);

    // Thay vì dùng findByMaTaiKhoanAndIsActiveTrue, dùng findById
    default Optional<User> findByMaTaiKhoanAndIsActiveTrue(Integer maTaiKhoan) {
        return findById(maTaiKhoan);
    }

    // Hoặc dùng query custom
    @Query("SELECT u FROM User u WHERE u.maTaiKhoan = :maTaiKhoan")
    Optional<User> findByMaTaiKhoan(@Param("maTaiKhoan") Integer maTaiKhoan);
}