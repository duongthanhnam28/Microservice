package com.thanhnam.userservice.command.aggregate;

import com.thanhnam.userservice.command.data.User;
import com.thanhnam.userservice.command.data.UserRole;
import com.thanhnam.userservice.command.event.*;
import com.thanhnam.userservice.command.command.*;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

public class UserAggregate {

    private User user;
    private Set<UserRole> userRoles = new HashSet<>();

    // Validation patterns
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^(\\+84|0)\\d{9,10}$");

    public UserAggregate() {}

    public UserAggregate(User user) {
        this.user = user;
    }

    // Command handlers
    public UserCreatedEvent handle(CreateUserCommand command) {
        // Enhanced validation
        validateCreateCommand(command);

        // Create user
        this.user = new User(
                command.getTen(),
                command.getNgaySinh(),
                command.getSdt(),
                command.getDiaChi(),
                command.getEmail(),
                command.getMatKhau(),
                command.getMaCV()
        );

        return new UserCreatedEvent(
                this.user.getMaTaiKhoan(),
                this.user.getTen(),
                this.user.getNgaySinh(),
                this.user.getSdt(),
                this.user.getDiaChi(),
                this.user.getEmail(),
                this.user.getMatKhau(),
                this.user.getMaCV()
        );
    }

    public UserUpdatedEvent handle(UpdateUserCommand command) {
        // Validate business rules
        if (this.user == null) {
            throw new IllegalStateException("User không tồn tại");
        }

        if (!this.user.getMaTaiKhoan().equals(command.getMaTaiKhoan())) {
            throw new IllegalArgumentException("Mã tài khoản không khớp");
        }

        validateUpdateCommand(command);

        // Apply updates only if values are provided
        if (command.getEmail() != null && !command.getEmail().trim().isEmpty()) {
            this.user.setEmail(command.getEmail());
        }

        if (command.getTen() != null && !command.getTen().trim().isEmpty()) {
            this.user.setTen(command.getTen());
        }

        if (command.getNgaySinh() != null) {
            this.user.setNgaySinh(command.getNgaySinh());
        }

        if (command.getSdt() != null && !command.getSdt().trim().isEmpty()) {
            this.user.setSdt(command.getSdt());
        }

        if (command.getDiaChi() != null) {
            this.user.setDiaChi(command.getDiaChi());
        }

        if (command.getMatKhau() != null && !command.getMatKhau().trim().isEmpty()) {
            this.user.setMatKhau(command.getMatKhau());
        }

        // Note: MaCV is managed through UserRole relationship, not directly on User
        // The setMaCV method doesn't exist on User entity

        return new UserUpdatedEvent(
                this.user.getMaTaiKhoan(),
                this.user.getTen(),
                this.user.getNgaySinh(),
                this.user.getSdt(),
                this.user.getDiaChi(),
                this.user.getEmail(),
                this.user.getMatKhau(),
                this.user.getMaCV()
        );
    }

    public UserDeletedEvent handle(DeleteUserCommand command) {
        if (this.user == null) {
            throw new IllegalStateException("User không tồn tại");
        }

        if (!this.user.getMaTaiKhoan().equals(command.getMaTaiKhoan())) {
            throw new IllegalArgumentException("Mã tài khoản không khớp");
        }

        return new UserDeletedEvent(this.user.getMaTaiKhoan());
    }

    public UserRoleAssignedEvent handle(AssignRoleCommand command) {
        if (this.user == null) {
            throw new IllegalStateException("User không tồn tại");
        }

        if (!this.user.getMaTaiKhoan().equals(command.getMaTaiKhoan())) {
            throw new IllegalArgumentException("Mã tài khoản không khớp");
        }

        if (command.getMaChucVu() == null) {
            throw new IllegalArgumentException("Mã chức vụ không được null");
        }

        // Check if role already exists
        boolean roleExists = this.userRoles.stream()
                .anyMatch(role -> role.getMaChucVu().equals(command.getMaChucVu()));

        if (roleExists) {
            throw new IllegalStateException("User đã có role này");
        }

        UserRole userRole = new UserRole(
                command.getMaTaiKhoan(),
                command.getMaChucVu()
        );

        this.userRoles.add(userRole);

        return new UserRoleAssignedEvent(
                command.getMaTaiKhoan(),
                command.getMaChucVu(),
                command.getTen()
        );
    }

    public UserRoleRemovedEvent handle(RemoveRoleCommand command) {
        if (this.user == null) {
            throw new IllegalStateException("User không tồn tại");
        }

        if (!this.user.getMaTaiKhoan().equals(command.getMaTaiKhoan())) {
            throw new IllegalArgumentException("Mã tài khoản không khớp");
        }

        if (command.getMaChucVu() == null) {
            throw new IllegalArgumentException("Mã chức vụ không được null");
        }

        boolean roleRemoved = this.userRoles.removeIf(
                role -> role.getMaChucVu().equals(command.getMaChucVu())
        );

        if (!roleRemoved) {
            throw new IllegalStateException("User không có role này");
        }

        return new UserRoleRemovedEvent(
                command.getMaTaiKhoan(),
                command.getMaChucVu()
        );
    }

    // Event handlers
    public void on(UserCreatedEvent event) {
        this.user = new User(
                event.getTen(),
                event.getNgaySinh(),
                event.getSdt(),
                event.getDiaChi(),
                event.getEmail(),
                event.getMatKhau(),
                event.getMaCV()
        );
        this.user.setMaTaiKhoan(event.getMaTaiKhoan());
    }

    public void on(UserUpdatedEvent event) {
        if (this.user == null) {
            this.user = new User();
        }

        this.user.setMaTaiKhoan(event.getMaTaiKhoan());
        this.user.setTen(event.getTen());
        this.user.setNgaySinh(event.getNgaySinh());
        this.user.setSdt(event.getSdt());
        this.user.setDiaChi(event.getDiaChi());
        this.user.setEmail(event.getEmail());
        this.user.setMatKhau(event.getMatKhau());
        // Note: MaCV is managed through UserRole relationship, not directly on User
    }

    public void on(UserRoleAssignedEvent event) {
        UserRole userRole = new UserRole(
                event.getMaTaiKhoan(),
                event.getMaChucVu()
        );
        this.userRoles.add(userRole);
    }

    public void on(UserRoleRemovedEvent event) {
        this.userRoles.removeIf(role -> role.getMaChucVu().equals(event.getMaChucVu()));
    }

    // Validation methods
    private void validateCreateCommand(CreateUserCommand command) {
        if (command == null) {
            throw new IllegalArgumentException("Command không được null");
        }

        if (command.getEmail() == null || command.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống");
        }

        if (command.getMatKhau() == null || command.getMatKhau().trim().isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }

        if (command.getTen() == null || command.getTen().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên không được để trống");
        }

        // Validate email format
        if (!EMAIL_PATTERN.matcher(command.getEmail()).matches()) {
            throw new IllegalArgumentException("Email không đúng định dạng");
        }

        // Validate password strength
        if (command.getMatKhau().length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        // Validate phone number if provided
        if (command.getSdt() != null && !command.getSdt().trim().isEmpty()) {
            if (!PHONE_PATTERN.matcher(command.getSdt()).matches()) {
                throw new IllegalArgumentException("Số điện thoại không đúng định dạng");
            }
        }
    }

    private void validateUpdateCommand(UpdateUserCommand command) {
        if (command == null) {
            throw new IllegalArgumentException("Command không được null");
        }

        if (command.getMaTaiKhoan() == null) {
            throw new IllegalArgumentException("Mã tài khoản không được null");
        }

        // Validate email format if provided
        if (command.getEmail() != null && !command.getEmail().trim().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(command.getEmail()).matches()) {
                throw new IllegalArgumentException("Email không đúng định dạng");
            }
        }

        // Validate password strength if provided
        if (command.getMatKhau() != null && !command.getMatKhau().trim().isEmpty()) {
            if (command.getMatKhau().length() < 6) {
                throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
            }
        }

        // Validate phone number if provided
        if (command.getSdt() != null && !command.getSdt().trim().isEmpty()) {
            if (!PHONE_PATTERN.matcher(command.getSdt()).matches()) {
                throw new IllegalArgumentException("Số điện thoại không đúng định dạng");
            }
        }
    }

    // Getters
    public User getUser() {
        return user;
    }

    public Set<UserRole> getUserRoles() {
        return new HashSet<>(userRoles); // Return defensive copy
    }

    // Business methods
    public boolean hasRole(Integer maChucVu) {
        return this.userRoles.stream()
                .anyMatch(role -> role.getMaChucVu().equals(maChucVu));
    }

    public boolean isActive() {
        return this.user != null && this.user.getMaTaiKhoan() != null;
    }
}