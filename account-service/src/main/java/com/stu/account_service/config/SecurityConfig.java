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
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Authentication endpoints - public
                        .requestMatchers("/auth/login", "/auth/register", "/auth/refresh", "/auth/logout").permitAll()

                        // User existence check - public (cho order-service gọi)
                        .requestMatchers(HttpMethod.GET, "/users/exists/**").permitAll()

                        // Temporary public endpoint (có thể xóa sau)
                        .requestMatchers("/users/admin/addRoleToUser").permitAll()

                        // Admin endpoints - cần quyền admin
                        .requestMatchers("/users/admin/**").hasRole("ADMIN")
                        .requestMatchers("/roles/**").hasRole("ADMIN")
                        .requestMatchers("/permissions/**").hasRole("ADMIN")

                        // User endpoints - cần authentication (PHẢI ĐẶT SAU /users/exists/**)
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
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

/*
LUỒNG XỬ LÝ ĐƯỢC CẬP NHẬT:

1. PUBLIC ENDPOINTS (không cần token):
   - /auth/** (login, register, refresh, logout)
   - GET /users/exists/** (cho order-service kiểm tra user tồn tại)

2. ADMIN ENDPOINTS (cần token + role ADMIN):
   - /users/admin/**
   - /roles/**
   - /permissions/**

3. USER ENDPOINTS (cần token):
   - /users/** (trừ admin và exists)

4. VÍ DỤ LUỒNG XỬ LÝ:
   - Order-service gọi GET /users/exists/2
   → Không cần token → Trả về kết quả ngay lập tức

   - Client gọi GET /users/admin/2
   → Cần token + role ADMIN → JwtAuthenticationFilter kiểm tra → Nếu OK thì cho phép truy cập
*/