package com.thanhnam.userservice.command.event;

public class UserRoleAssignedEvent {
    
    private Integer maTaiKhoan;
    private Integer maChucVu;
    private String ten;
    
    public UserRoleAssignedEvent() {}
    
    public UserRoleAssignedEvent(Integer maTaiKhoan, Integer maChucVu, String ten) {
        this.maTaiKhoan = maTaiKhoan;
        this.maChucVu = maChucVu;
        this.ten = ten;
    }
    
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
} 