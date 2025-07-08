package com.thanhnam.userservice.query.controller;

import com.thanhnam.userservice.command.data.User;
import com.thanhnam.userservice.command.data.UserRepository;
import com.thanhnam.userservice.command.data.Role;
import com.thanhnam.userservice.command.data.RoleRepository;
import com.thanhnam.userservice.query.model.UserResponseModel;
import com.thanhnam.userservice.query.model.RoleResponseModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/users")
public class UserQueryController {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserQueryController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<UserResponseModel> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponseModel).collect(Collectors.toList());
    }

    @GetMapping("/{maTaiKhoan}")
    public ResponseEntity<UserResponseModel> getUserById(@PathVariable("maTaiKhoan") Integer maTaiKhoan) {
        Optional<User> userOpt = userRepository.findById(maTaiKhoan);
        return userOpt.map(user -> ResponseEntity.ok(toResponseModel(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseModel> getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(toResponseModel(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/roles")
    public List<RoleResponseModel> getAllRoles() {
        return roleRepository.findAll().stream().map(this::toRoleResponseModel).collect(Collectors.toList());
    }

    @GetMapping("/roles/{maCV}")
    public ResponseEntity<RoleResponseModel> getRoleById(@PathVariable("maCV") Integer maCV) {
        Optional<Role> roleOpt = roleRepository.findById(maCV);
        return roleOpt.map(role -> ResponseEntity.ok(toRoleResponseModel(role)))
                .orElse(ResponseEntity.notFound().build());
    }

    private UserResponseModel toResponseModel(User user) {
        return UserResponseModel.builder()
                .maTaiKhoan(user.getMaTaiKhoan())
                .ten(user.getTen())
                .ngaySinh(user.getNgaySinh())
                .sdt(user.getSdt())
                .diaChi(user.getDiaChi())
                .email(user.getEmail())
                .matKhau(user.getMatKhau())
                .maCV(user.getMaCV())
                .build();
    }

    private RoleResponseModel toRoleResponseModel(Role role) {
        return RoleResponseModel.builder()
                .maCV(role.getMaCV())
                .tenChucVu(role.getTenChucVu())
                .build();
    }
}

