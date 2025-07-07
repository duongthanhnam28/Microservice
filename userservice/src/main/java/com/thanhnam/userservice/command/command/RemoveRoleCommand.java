package com.thanhnam.userservice.command.command;

public class RemoveRoleCommand {
    
    private Integer maTaiKhoan;
    private Integer maChucVu;
    
    public RemoveRoleCommand() {}
    
    public RemoveRoleCommand(Integer maTaiKhoan, Integer maChucVu) {
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