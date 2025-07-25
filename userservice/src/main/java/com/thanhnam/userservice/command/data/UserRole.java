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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaTaiKhoan", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaChucVu", insertable = false, updatable = false)
    private Role role;

    public UserRole() {}

    public UserRole(Integer maTaiKhoan, Integer maChucVu) {
        this.maTaiKhoan = maTaiKhoan;
        this.maChucVu = maChucVu;
    }

    // Helper method to get role name from Role entity
    public String getTenChucVu() {
        return role != null ? role.getTenChucVu() : null;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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