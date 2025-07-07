package com.thanhnam.userservice.command.command;

import java.time.LocalDate;

public class UpdateUserCommand {
    
    private Integer maTaiKhoan;
    private String ten;
    private LocalDate ngaySinh;
    private String sdt;
    private String diaChi;
    private String email;
    private String matKhau;
    private Integer maCV;
    
    public UpdateUserCommand() {}
    
    public UpdateUserCommand(Integer maTaiKhoan, String ten, LocalDate ngaySinh, String sdt, 
                           String diaChi, String email, String matKhau, Integer maCV) {
        this.maTaiKhoan = maTaiKhoan;
        this.ten = ten;
        this.ngaySinh = ngaySinh;
        this.sdt = sdt;
        this.diaChi = diaChi;
        this.email = email;
        this.matKhau = matKhau;
        this.maCV = maCV;
    }
    
    // Getters and Setters
    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }
    
    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }
    
    public String getTen() {
        return ten;
    }
    
    public void setTen(String ten) {
        this.ten = ten;
    }
    
    public LocalDate getNgaySinh() {
        return ngaySinh;
    }
    
    public void setNgaySinh(LocalDate ngaySinh) {
        this.ngaySinh = ngaySinh;
    }
    
    public String getSdt() {
        return sdt;
    }
    
    public void setSdt(String sdt) {
        this.sdt = sdt;
    }
    
    public String getDiaChi() {
        return diaChi;
    }
    
    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMatKhau() {
        return matKhau;
    }
    
    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }
    
    public Integer getMaCV() {
        return maCV;
    }
    
    public void setMaCV(Integer maCV) {
        this.maCV = maCV;
    }
}