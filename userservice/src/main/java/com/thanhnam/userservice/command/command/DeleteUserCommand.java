package com.thanhnam.userservice.command.command;

public class DeleteUserCommand {
    
    private Integer maTaiKhoan;
    
    public DeleteUserCommand() {}
    
    public DeleteUserCommand(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }
    
    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }
    
    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }
}