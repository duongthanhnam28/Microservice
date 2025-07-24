// FIXED UserService.java - Add updateUserProfile method
package com.stu.account_service.service;

import com.stu.account_service.dto.request.AddRoleToUserRequest;
import com.stu.account_service.dto.request.ChangePasswordRequest;
import com.stu.account_service.dto.request.CreateUserWithRolesRequest;
import com.stu.account_service.dto.request.RegisterRequest;
import com.stu.account_service.dto.request.UpdateUserRequest;
import com.stu.account_service.dto.response.UserResponse;
import com.stu.account_service.dto.response.RoleResponse;
import com.stu.account_service.entity.Role;
import com.stu.account_service.entity.User;
import com.stu.account_service.entity.Permission;
import com.stu.account_service.exception.AppException;
import com.stu.account_service.exception.ErrorCode;
import com.stu.account_service.repository.RoleRepository;
import com.stu.account_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    @Override
    public User loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail));
    }

    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Tạo user thất bại: Username {} đã tồn tại", request.getUsername());
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Tạo user thất bại: Email {} đã tồn tại", request.getEmail());
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .lastName(request.getLastName())
                .firstName(request.getFirstName())
                .phoneNumber(request.getPhoneNumber())
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .createdAt(LocalDateTime.now())
                .build();

        // Gán role USER mặc định cho tất cả user mới
        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.addRole(defaultRole);

        User savedUser = userRepository.save(user);

        log.info("User created successfully with ID: {} and default USER role", savedUser.getId());
        return convertToUserResponse(savedUser);
    }

    // ADDED: Update user profile method
    public UserResponse updateUserProfile(String username, UpdateUserRequest request) {
        log.info("Updating profile for user: {} with data: {}", username, request);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Update user fields
        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            user.setFirstName(request.getFirstName().trim());
        }

        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            user.setLastName(request.getLastName().trim());
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }

        // Set updated timestamp
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("User profile updated successfully for: {}", username);

        return convertToUserResponse(savedUser);
    }

    /**
     * Kiểm tra user có tồn tại theo ID hay không
     * Method này được sử dụng bởi các service khác (như order-service)
     * để validate user tồn tại mà không cần authentication
     */
    public boolean userExistsById(Long userId) {
        try {
            log.info("Checking if user exists with ID: {}", userId);

            if (userId == null) {
                log.warn("User ID is null");
                return false;
            }

            boolean exists = userRepository.existsById(userId);
            log.info("User with ID {} exists: {}", userId, exists);
            return exists;

        } catch (Exception e) {
            log.error("Error checking if user exists with ID {}: {}", userId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Tạo user với role cụ thể - chỉ dành cho ADMIN
     * @param request Thông tin đăng ký user bao gồm roles
     * @return UserResponse
     */
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUserWithRoles(CreateUserWithRolesRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Tạo user thất bại: Username {} đã tồn tại", request.getUsername());
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Tạo user thất bại: Email {} đã tồn tại", request.getEmail());
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Validation: Kiểm tra role được gán có hợp lệ không
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleName : request.getRoles()) {
                if (!roleRepository.findByName(roleName).isPresent()) {
                    log.warn("Tạo user thất bại: Role {} không tồn tại", roleName);
                    throw new AppException(ErrorCode.ROLE_NOT_FOUND);
                }

                // Validation: Không cho phép tạo user với role ADMIN (bảo mật)
                if ("ADMIN".equals(roleName)) {
                    log.warn("Tạo user thất bại: Không được phép tạo user với role ADMIN");
                    throw new AppException(ErrorCode.INVALID_ROLE_NAME, "Không được phép tạo user với role ADMIN");
                }
            }
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .lastName(request.getLastName())
                .firstName(request.getFirstName())
                .phoneNumber(request.getPhoneNumber())
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .createdAt(LocalDateTime.now())
                .build();

        // Gán các role được chỉ định trong request
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                user.addRole(role);
            }
        } else {
            // Fallback về USER role nếu không có role nào được chỉ định
            Role defaultRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            user.addRole(defaultRole);
        }

        User savedUser = userRepository.save(user);

        log.info("User created successfully with ID: {} and roles: {}",
                savedUser.getId(), request.getRoles());
        return convertToUserResponse(savedUser);
    }

    public UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .enabled(user.getEnabled())
                .roles(user.getRoles().stream().map(roleService::toResponse).collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH, "Current password is incorrect");
        }

        // Kiểm tra mật khẩu mới khác mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD, "New password must be different from current password");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User {} changed password successfully", username);
    }

    //hàm gán thêm role cho user bỏi admin (dùng khi m̀ admin cần cấp thêm quyền cho user)
    public UserResponse addRoleToUser(AddRoleToUserRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        user.getRoles().add(role);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return convertToUserResponse(user);
    }

    // xóa role khỏi một user bởi admin
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse removeRoleFromUser(AddRoleToUserRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.getRoles().remove(role);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return convertToUserResponse(user);
    }

    public java.util.Set<String> getUserRoles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return user.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toSet());
    }

    public java.util.Set<String> getUserPermissions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(com.stu.account_service.entity.Permission::getName)
                .collect(java.util.stream.Collectors.toSet());
    }

    // người dùng tự lấy thông tin đăng nhập
    public UserResponse getMyInfor(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));

        return convertToUserResponse(user);
    }

    // get one user by admin
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getOneUser(Long id){
        var user= userRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));
        return convertToUserResponse(user);
    }

    // get all user by admin
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUser(){
        log.info("In method get all user by admin");
        List<User> users = userRepository.findAll();
        List<UserResponse> responses = new ArrayList<>();
        for(User user:users) {
            UserResponse response = convertToUserResponse(user);
            responses.add(response);
        }
        return responses;
    }

    /**
     * Debug method để kiểm tra permissions của user
     */
    public void debugUserPermissions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        log.info("=== Debug User Permissions ===");
        log.info("User: {}", user.getUsername());
        log.info("Roles: {}", user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));

        for (Role role : user.getRoles()) {
            log.info("Role '{}' has permissions: {}",
                    role.getName(),
                    role.getPermissions().stream().map(Permission::getName).collect(Collectors.toSet()));
        }

        log.info("All authorities: {}", user.getAuthorities());
        log.info("===============================");
    }
}