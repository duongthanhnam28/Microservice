package com.thanhnam.userservice.command.service;

import com.thanhnam.userservice.command.aggregate.UserAggregate;
import com.thanhnam.userservice.command.data.User;
import com.thanhnam.userservice.command.data.UserRole;
import com.thanhnam.userservice.command.command.*;
import com.thanhnam.userservice.command.data.UserRepository;
import com.thanhnam.userservice.command.data.UserRoleRepository;
import com.thanhnam.userservice.command.event.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@Transactional
public class UserCommandService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private EventPublisher eventPublisher;

    public UserCreatedEvent createUser(CreateUserCommand command) {
        // Validate command
        if (command == null) {
            throw new IllegalArgumentException("CreateUserCommand không được null");
        }

        // Check email uniqueness
        if (userRepository.existsByEmail(command.getEmail())) {
            throw new RuntimeException("Email đã tồn tại: " + command.getEmail());
        }

        try {
            // Create aggregate and handle command
            UserAggregate aggregate = new UserAggregate();
            UserCreatedEvent event = aggregate.handle(command);

            // Save user to database
            User user = aggregate.getUser();
            User savedUser = userRepository.save(user);

            // Update event with generated ID
            event.setMaTaiKhoan(savedUser.getMaTaiKhoan());

            // Publish event
            eventPublisher.publish(event);

            return event;
        } catch (IllegalArgumentException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo user: " + e.getMessage(), e);
        }
    }

    public UserUpdatedEvent updateUser(UpdateUserCommand command) {
        // Validate command
        if (command == null || command.getMaTaiKhoan() == null) {
            throw new IllegalArgumentException("UpdateUserCommand hoặc MaTaiKhoan không được null");
        }

        // Check if user exists
        User user = userRepository.findById(command.getMaTaiKhoan())
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + command.getMaTaiKhoan()));

        // Check email uniqueness if email is being changed
        if (StringUtils.hasText(command.getEmail()) && !command.getEmail().equals(user.getEmail())) {
            User existingUser = userRepository.findByEmail(command.getEmail());
            if (existingUser != null && !existingUser.getMaTaiKhoan().equals(command.getMaTaiKhoan())) {
                throw new RuntimeException("Email đã được sử dụng bởi user khác: " + command.getEmail());
            }
        }

        try {
            // Create aggregate and handle command
            UserAggregate aggregate = new UserAggregate(user);
            UserUpdatedEvent event = aggregate.handle(command);

            // Save changes
            userRepository.save(user);

            // Publish event
            eventPublisher.publish(event);

            return event;
        } catch (IllegalArgumentException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Không thể cập nhật user: " + e.getMessage(), e);
        }
    }

    public UserDeletedEvent deleteUser(DeleteUserCommand command) {
        // Validate command
        if (command == null || command.getMaTaiKhoan() == null) {
            throw new IllegalArgumentException("DeleteUserCommand hoặc MaTaiKhoan không được null");
        }

        // Check if user exists
        User user = userRepository.findById(command.getMaTaiKhoan())
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + command.getMaTaiKhoan()));

        try {
            // Create aggregate and handle command
            UserAggregate aggregate = new UserAggregate(user);
            UserDeletedEvent event = aggregate.handle(command);

            // Delete user roles first (foreign key constraint)
            List<UserRole> userRoles = userRoleRepository.findByMaTaiKhoan(command.getMaTaiKhoan());
            if (!userRoles.isEmpty()) {
                userRoleRepository.deleteAll(userRoles);
            }

            // Delete user
            userRepository.delete(user);

            // Publish event
            eventPublisher.publish(event);

            return event;
        } catch (IllegalArgumentException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa user: " + e.getMessage(), e);
        }
    }

    public UserRoleAssignedEvent assignRole(AssignRoleCommand command) {
        // Validate command
        if (command == null || command.getMaTaiKhoan() == null || command.getMaChucVu() == null) {
            throw new IllegalArgumentException("AssignRoleCommand, MaTaiKhoan hoặc MaChucVu không được null");
        }

        // Check if user exists
        User user = userRepository.findById(command.getMaTaiKhoan())
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + command.getMaTaiKhoan()));

        // Check if role already exists
        UserRole existingRole = userRoleRepository.findById(
                new com.thanhnam.userservice.command.data.UserRoleId(
                        command.getMaTaiKhoan(), command.getMaChucVu()
                )
        ).orElse(null);

        if (existingRole != null) {
            throw new RuntimeException("User đã có role này: " + command.getMaChucVu());
        }

        try {
            // Create aggregate and handle command
            UserAggregate aggregate = new UserAggregate(user);
            UserRoleAssignedEvent event = aggregate.handle(command);

            // Save new role
            UserRole userRole = new UserRole(
                    command.getMaTaiKhoan(),
                    command.getMaChucVu()
            );
            userRoleRepository.save(userRole);

            // Publish event
            eventPublisher.publish(event);

            return event;
        } catch (IllegalArgumentException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Không thể gán role: " + e.getMessage(), e);
        }
    }

    public UserRoleRemovedEvent removeRole(RemoveRoleCommand command) {
        // Validate command
        if (command == null || command.getMaTaiKhoan() == null || command.getMaChucVu() == null) {
            throw new IllegalArgumentException("RemoveRoleCommand, MaTaiKhoan hoặc MaChucVu không được null");
        }

        // Check if user exists
        User user = userRepository.findById(command.getMaTaiKhoan())
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + command.getMaTaiKhoan()));

        // Check if role exists
        UserRole existingRole = userRoleRepository.findById(
                new com.thanhnam.userservice.command.data.UserRoleId(
                        command.getMaTaiKhoan(), command.getMaChucVu()
                )
        ).orElse(null);

        if (existingRole == null) {
            throw new RuntimeException("User không có role này: " + command.getMaChucVu());
        }

        try {
            // Create aggregate and handle command
            UserAggregate aggregate = new UserAggregate(user);
            UserRoleRemovedEvent event = aggregate.handle(command);

            // Remove role
            userRoleRepository.deleteByMaTaiKhoanAndMaChucVu(
                    command.getMaTaiKhoan(), command.getMaChucVu()
            );

            // Publish event
            eventPublisher.publish(event);

            return event;
        } catch (IllegalArgumentException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa role: " + e.getMessage(), e);
        }
    }
}