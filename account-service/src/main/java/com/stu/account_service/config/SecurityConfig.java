// FIXED account-service/src/main/java/com/stu/account_service/config/SecurityConfig.java
package com.stu.account_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // FIXED: Enable CORS and disable CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // FIXED: Authentication endpoints - public (MUST BE FIRST)
                        .requestMatchers("/auth/login", "/auth/register", "/auth/refresh", "/auth/logout").permitAll()

                        // FIXED: User existence check - public FOR INTER-SERVICE COMMUNICATION (MUST BE SECOND)
                        .requestMatchers(HttpMethod.GET, "/users/exists/*", "/users/exists/**").permitAll()

                        // FIXED: Temporary public endpoint (có thể xóa sau)
                        .requestMatchers("/users/admin/addRoleToUser").permitAll()

                        // FIXED: OPTIONS requests - permitAll for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // FIXED: Admin endpoints - cần quyền admin
                        .requestMatchers("/users/admin/**").hasRole("ADMIN")
                        .requestMatchers("/roles/**").hasRole("ADMIN")
                        .requestMatchers("/permissions/**").hasRole("ADMIN")

                        // FIXED: User endpoints - cần authentication (PHẢI ĐẶT SAU PUBLIC ENDPOINTS)
                        .requestMatchers("/users/**").authenticated()

                        // Tất cả request khác cần authentication
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // FIXED: Allow specific origins in development AND inter-service calls
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",    // React dev server
                "http://127.0.0.1:3000",
                "http://localhost:3001",    // Alternative ports
                "http://127.0.0.1:3001",
                "http://localhost:9003",    // Order service
                "http://localhost:9004",    // Order service alternative
                "http://127.0.0.1:9003",
                "http://127.0.0.1:9004"
        ));

        // Allow all common HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));

        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials (important for authentication)
        configuration.setAllowCredentials(true);

        // Cache preflight requests for 1 hour
        configuration.setMaxAge(3600L);

        // Expose common headers to frontend
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

/*
FIXED LUỒNG XỬ LÝ CORS & AUTHENTICATION:

1. PUBLIC ENDPOINTS (không cần token) - ƯU TIÊN CAO NHẤT:
   - /auth/** (login, register, refresh, logout)
   - GET /users/exists/* và /users/exists/** (cho order-service kiểm tra user tồn tại)
   - OPTIONS /** (cho CORS preflight requests)

2. ADMIN ENDPOINTS (cần token + role ADMIN):
   - /users/admin/**
   - /roles/**
   - /permissions/**

3. USER ENDPOINTS (cần token):
   - /users/** (trừ admin và exists endpoints)

4. ORDER SERVICE INTEGRATION:
   - Order service có thể gọi GET /users/exists/{id} mà không cần authentication
   - Endpoint này được thiết kế riêng cho inter-service communication
   - CORS đã được cấu hình cho phép requests từ order service ports

5. VÍ DỤ LUỒNG XỬ LÝ:
   - Order service gọi GET /users/exists/23 (không cần Authorization header)
   → SecurityConfig cho phép vì matching pattern /users/exists/**
   → UserController.checkUserExists() được gọi
   → Trả về ApiResponse<Boolean> cho order service
*/