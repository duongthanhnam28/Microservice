// FIXED UserController.java - Add update profile endpoint
package com.stu.account_service.controller;

import com.stu.account_service.dto.request.*;
import com.stu.account_service.dto.response.ApiResponse;
import com.stu.account_service.dto.response.AuthenticationResponse;
import com.stu.account_service.dto.response.UserResponse;
import com.stu.account_service.service.AuthenticationService;
import com.stu.account_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // <-- Lấy username từ context
        userService.changePassword(username, request); // <-- Chỉ đổi mật khẩu cho chính mình
        return ApiResponse.<Void>builder()
                .message("Đổi mật khẩu thành công")
                .timestamp(LocalDateTime.now())
                .build();
    }

    // ADDED: Update profile endpoint
    @PutMapping("/profile")
    public ApiResponse<UserResponse> updateProfile(@RequestBody @Valid UpdateUserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        log.info("Updating profile for user: {}", username);

        UserResponse updatedUser = userService.updateUserProfile(username, request);

        return ApiResponse.<UserResponse>builder()
                .result(updatedUser)
                .message("Cập nhật thông tin thành công")
                .timestamp(LocalDateTime.now())
                .build();
    }

    // Cấp thêm role cho user
    @PostMapping("/admin/addRoleToUser")
    public ApiResponse<UserResponse> addRoleToUser(@RequestBody AddRoleToUserRequest request){
        return ApiResponse.<UserResponse>builder()
                .result( userService.addRoleToUser(request))
                .message("Cập nhập role thành công")
                .build();
    }

    @DeleteMapping("/admin/removeRole")
    public ApiResponse<UserResponse> removeRoleFromUser(@RequestBody @Valid AddRoleToUserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.removeRoleFromUser(request))
                .message("Xóa role thành công")
                .build();
    }

    @GetMapping("/{userId}/roles")
    public java.util.Set<String> getUserRoles(@PathVariable Long userId) {
        return userService.getUserRoles(userId);
    }

    @GetMapping("/{userId}/permissions")
    public java.util.Set<String> getUserPermissions(@PathVariable Long userId) {
        return userService.getUserPermissions(userId);
    }

    @GetMapping("/myInfo")
    public ApiResponse<UserResponse> getUserInfo(){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfor())
                .message("Lấy thông tin người dùng thành công")
                .build();

    }
    // Endpoint public để kiểm tra user tồn tại - KHÔNG yêu cầu authentication
    @GetMapping("/exists/{userId}")
    public ApiResponse<Boolean> checkUserExists(@PathVariable Long userId){
        log.info("Checking if user exists with ID: {}", userId);
        boolean exists = userService.userExistsById(userId);
        return ApiResponse.<Boolean>builder()
                .result(exists)
                .message(exists ? "User exists" : "User not found")
                .timestamp(LocalDateTime.now())
                .build();
    }

    // get one user by amdin
    @GetMapping("/admin/{userId}")
    public ApiResponse<UserResponse> getOneUser(@PathVariable Long userId){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getOneUser(userId))
                .message("Lấy thông tin người dùng")
                .build();
    }

    // get All User by admin
    @GetMapping("/admin/allUser")
    public ApiResponse<List<UserResponse>> getAlUser(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUser())
                .build();

    }

    // Tạo user với role cụ thể - chỉ dành cho ADMIN
    @PostMapping("/admin/create-user-with-roles")
    public ApiResponse<UserResponse> createUserWithRoles(@RequestBody @Valid CreateUserWithRolesRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUserWithRoles(request))
                .message("Tạo user với role thành công")
                .timestamp(LocalDateTime.now())
                .build();
    }

    // Debug endpoint để kiểm tra permissions
    @GetMapping("/debug/permissions/{username}")
    public ApiResponse<Void> debugUserPermissions(@PathVariable String username) {
        userService.debugUserPermissions(username);
        return ApiResponse.<Void>builder()
                .message("Debug permissions completed, check logs")
                .timestamp(LocalDateTime.now())
                .build();
    }
}