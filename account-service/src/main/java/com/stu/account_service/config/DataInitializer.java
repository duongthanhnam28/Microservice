 package com.stu.account_service.config;

 import com.stu.account_service.entity.Role;
 import com.stu.account_service.entity.Permission;
 import com.stu.account_service.repository.RoleRepository;
 import com.stu.account_service.repository.PermissionRepository;
 import org.springframework.boot.CommandLineRunner;
 import org.springframework.context.annotation.Bean;
 import org.springframework.context.annotation.Configuration;

 import java.util.Set;

 @Configuration
 public class DataInitializer {

     @Bean
     public CommandLineRunner initRolesAndPermissions(
             RoleRepository roleRepository,
             PermissionRepository permissionRepository) {
         return args -> {
             // Tạo permissions trước
             Permission readUser = createPermissionIfNotExists(permissionRepository,
                 "READ_USER", "Read user information");
             Permission updateUser = createPermissionIfNotExists(permissionRepository,
                 "UPDATE_USER", "Update user information");
             Permission deleteUser = createPermissionIfNotExists(permissionRepository,
                 "DELETE_USER", "Delete user");
             Permission createUser = createPermissionIfNotExists(permissionRepository,
                 "CREATE_USER", "Create new user");
             Permission readAllUsers = createPermissionIfNotExists(permissionRepository,
                 "READ_ALL_USERS", "Read all users");
             Permission manageRoles = createPermissionIfNotExists(permissionRepository,
                 "MANAGE_ROLES", "Manage user roles");
             Permission managePermissions = createPermissionIfNotExists(permissionRepository,
                 "MANAGE_PERMISSIONS", "Manage permissions");

             // Tạo hoặc update role USER
             Role userRole = roleRepository.findByName("USER")
                     .orElseGet(() -> Role.builder()
                             .name("USER")
                             .description("Regular user role")
                             .build());
            
             // Update permissions cho USER role
             userRole.setPermissions(Set.of(readUser, updateUser));
             roleRepository.save(userRole);

             // Tạo hoặc update role ADMIN
             Role adminRole = roleRepository.findByName("ADMIN")
                     .orElseGet(() -> Role.builder()
                             .name("ADMIN")
                             .description("Administrator role")
                             .build());
            
             // Update permissions cho ADMIN role
             adminRole.setPermissions(Set.of(readUser, updateUser, deleteUser, createUser,
                                            readAllUsers, manageRoles, managePermissions));
             roleRepository.save(adminRole);
            
             System.out.println("✅ Roles and permissions initialized successfully!");
         };
     }

     private Permission createPermissionIfNotExists(PermissionRepository repository,
                                                   String name, String description) {
         return repository.findByName(name)
                 .orElseGet(() -> {
                     Permission permission = Permission.builder()
                             .name(name)
                             .description(description)
                             .build();
                     return repository.save(permission);
                 });
     }
 }