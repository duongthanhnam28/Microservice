package com.thanhnam.userservice.command.event;

public class UserRoleRemovedEvent {
    
    private Integer maTaiKhoan;
    private Integer maChucVu;
    
    public UserRoleRemovedEvent() {}
    
    public UserRoleRemovedEvent(Integer maTaiKhoan, Integer maChucVu) {
        this.maTaiKhoan = maTaiKhoan;
        this.maChucVu = maChucVu;
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
} 