package com.thanhnam.userservice.command.data;

import jakarta.persistence.*;

@Entity
@Table(name = "TaiKhoan_ChucVu")
@IdClass(UserRoleId.class)
public class UserRole {
    
    @Id
    @Column(name = "MaTaiKhoan")
    private Integer maTaiKhoan;
    
    @Id
    @Column(name = "MaChucVu")
    private Integer maChucVu;
    
    @Column(name = "Ten")
    private String ten;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTaiKhoan", insertable = false, updatable = false)
    private User user;
    
    public UserRole() {}
    
    public UserRole(Integer maTaiKhoan, Integer maChucVu, String ten) {
        this.maTaiKhoan = maTaiKhoan;
        this.maChucVu = maChucVu;
        this.ten = ten;
    }
    
    // Getters and Setters
    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }
    
    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }
    
    public Integer getMaChucVu() {
        return maChucVu;
    }
    
    public void setMaChucVu(Integer maChucVu) {
        this.maChucVu = maChucVu;
    }
    
    public String getTen() {
        return ten;
    }
    
    public void setTen(String ten) {
        this.ten = ten;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        UserRole userRole = (UserRole) o;
        
        if (!maTaiKhoan.equals(userRole.maTaiKhoan)) return false;
        return maChucVu.equals(userRole.maChucVu);
    }
    
    @Override
    public int hashCode() {
        int result = maTaiKhoan.hashCode();
        result = 31 * result + maChucVu.hashCode();
        return result;
    }
} 