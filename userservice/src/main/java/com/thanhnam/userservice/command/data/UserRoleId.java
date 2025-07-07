package com.thanhnam.userservice.command.data;

import java.io.Serializable;
import java.util.Objects;

public class UserRoleId implements Serializable {
    
    private Integer maTaiKhoan;
    private Integer maChucVu;
    
    public UserRoleId() {}
    
    public UserRoleId(Integer maTaiKhoan, Integer maChucVu) {
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
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        UserRoleId that = (UserRoleId) o;
        return Objects.equals(maTaiKhoan, that.maTaiKhoan) &&
               Objects.equals(maChucVu, that.maChucVu);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(maTaiKhoan, maChucVu);
    }
} 