package com.stu.account_service.controller;

import com.stu.account_service.dto.request.CreateRoleRequest;
import com.stu.account_service.dto.response.ApiResponse;
import com.stu.account_service.dto.response.RoleResponse;
import com.stu.account_service.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/create")
    public ApiResponse<RoleResponse> createRole(@RequestBody CreateRoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(request))
                .message("Tạo role mới thành công ")
                .build();
    }

    @PutMapping("/update/{name}")
    public  ApiResponse<RoleResponse> updateRole(@PathVariable String name, @RequestBody CreateRoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result( roleService.updateRole(name, request))
                .message("Update role thành công")
                .build();

    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ApiResponse.<Void>builder()
                .message("Xóa role thành công")
                .build();
    }

    // lấy role theo id
    @GetMapping("/{id}")
    public RoleResponse getRole(@PathVariable Long id) {
        return roleService.getRole(id);
    }

    // lấy toàn book role
    @GetMapping ("/allRole")
    public ApiResponse<List<RoleResponse>>  getAllRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }
} 