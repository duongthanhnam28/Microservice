package com.thanhnam.userservice.command.event;

public class UserDeletedEvent {
    
    private Integer maTaiKhoan;
    
    public UserDeletedEvent() {}
    
    public UserDeletedEvent(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }
    
    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }
    
    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }
}