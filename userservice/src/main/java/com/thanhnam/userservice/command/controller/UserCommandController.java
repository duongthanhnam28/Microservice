package com.thanhnam.userservice.command.controller;

import com.thanhnam.userservice.command.command.*;
import com.thanhnam.userservice.command.event.*;
import com.thanhnam.userservice.command.service.UserCommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserCommandController {

    @Autowired
    private UserCommandService userCommandService;

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> request) {
        try {
            // Validate required fields
            validateCreateUserRequest(request);

            CreateUserCommand command = new CreateUserCommand(
                    (String) request.get("ten"),
                    request.get("ngaySinh") != null ? LocalDate.parse((String) request.get("ngaySinh")) : null,
                    (String) request.get("sdt"),
                    (String) request.get("diaChi"),
                    (String) request.get("email"),
                    (String) request.get("matKhau"),
                    request.get("maCV") != null ? Integer.valueOf(request.get("maCV").toString()) : null
            );

            UserCreatedEvent event = userCommandService.createUser(command);

            return ResponseEntity.ok(createSuccessResponse("Tạo user thành công", event));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Email đã tồn tại")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, Object> request) {
        try {
            // Validate required fields
            validateUpdateUserRequest(request);

            UpdateUserCommand command = new UpdateUserCommand(
                    Integer.valueOf(request.get("maTaiKhoan").toString()),
                    (String) request.get("ten"),
                    request.get("ngaySinh") != null ? LocalDate.parse((String) request.get("ngaySinh")) : null,
                    (String) request.get("sdt"),
                    (String) request.get("diaChi"),
                    (String) request.get("email"),
                    (String) request.get("matKhau"),
                    request.get("maCV") != null ? Integer.valueOf(request.get("maCV").toString()) : null
            );

            UserUpdatedEvent event = userCommandService.updateUser(command);

            return ResponseEntity.ok(createSuccessResponse("Cập nhật user thành công", event));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User không tồn tại")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            } else if (e.getMessage().contains("Email đã được sử dụng")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{maTaiKhoan}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer maTaiKhoan) {
        try {
            if (maTaiKhoan == null || maTaiKhoan <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Mã tài khoản không hợp lệ"));
            }

            DeleteUserCommand command = new DeleteUserCommand(maTaiKhoan);
            UserDeletedEvent event = userCommandService.deleteUser(command);

            return ResponseEntity.ok(createSuccessResponse("Xóa user thành công", event));

        } catch (RuntimeException e) {
            if (e.getMessage().contains("User không tồn tại")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PostMapping("/assign-role")
    public ResponseEntity<?> assignRole(@RequestBody Map<String, Object> request) {
        try {
            // Validate required fields
            validateAssignRoleRequest(request);

            AssignRoleCommand command = new AssignRoleCommand(
                    Integer.valueOf(request.get("maTaiKhoan").toString()),
                    Integer.valueOf(request.get("maChucVu").toString())
            );

            UserRoleAssignedEvent event = userCommandService.assignRole(command);

            return ResponseEntity.ok(createSuccessResponse("Gán role thành công", event));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User không tồn tại")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            } else if (e.getMessage().contains("User đã có role này")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @DeleteMapping("/remove-role")
    public ResponseEntity<?> removeRole(@RequestBody Map<String, Object> request) {
        try {
            // Validate required fields
            validateRemoveRoleRequest(request);

            RemoveRoleCommand command = new RemoveRoleCommand(
                    Integer.valueOf(request.get("maTaiKhoan").toString()),
                    Integer.valueOf(request.get("maChucVu").toString())
            );

            UserRoleRemovedEvent event = userCommandService.removeRole(command);

            return ResponseEntity.ok(createSuccessResponse("Xóa role thành công", event));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User không tồn tại")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            } else if (e.getMessage().contains("User không có role này")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // Validation methods
    private void validateCreateUserRequest(Map<String, Object> request) {
        if (request.get("ten") == null || request.get("ten").toString().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên không được để trống");
        }
        if (request.get("email") == null || request.get("email").toString().trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (request.get("matKhau") == null || request.get("matKhau").toString().trim().isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }
    }

    private void validateUpdateUserRequest(Map<String, Object> request) {
        if (request.get("maTaiKhoan") == null) {
            throw new IllegalArgumentException("Mã tài khoản không được để trống");
        }
    }

    private void validateAssignRoleRequest(Map<String, Object> request) {
        if (request.get("maTaiKhoan") == null) {
            throw new IllegalArgumentException("Mã tài khoản không được để trống");
        }
        if (request.get("maChucVu") == null) {
            throw new IllegalArgumentException("Mã chức vụ không được để trống");
        }
    }

    private void validateRemoveRoleRequest(Map<String, Object> request) {
        if (request.get("maTaiKhoan") == null) {
            throw new IllegalArgumentException("Mã tài khoản không được để trống");
        }
        if (request.get("maChucVu") == null) {
            throw new IllegalArgumentException("Mã chức vụ không được để trống");
        }
    }

    // Helper methods to create response
    private Map<String, Object> createSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}