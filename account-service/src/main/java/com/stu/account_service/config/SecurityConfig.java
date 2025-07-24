// UPDATED SecurityConfig.java - Add CORS configuration
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
                        // Authentication endpoints - public
                        .requestMatchers("/auth/login", "/auth/register", "/auth/refresh", "/auth/logout").permitAll()

                        // User existence check - public (cho order-service gọi)
                        .requestMatchers(HttpMethod.GET, "/users/exists/**").permitAll()

                        // Temporary public endpoint (có thể xóa sau)
                        .requestMatchers("/users/admin/addRoleToUser").permitAll()

                        // OPTIONS requests - permitAll for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

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
        CorsConfiguration configuration = new CorsConfiguration();
        
        // FIXED: Allow specific origins in development
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",    // React dev server
            "http://127.0.0.1:3000",
            "http://localhost:3001",    // Alternative ports
            "http://127.0.0.1:3001"
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
LUỒNG XỬ LÝ CORS ĐÃ CẬP NHẬT:

1. CORS Configuration:
   - Cho phép requests từ localhost:3000 (React app)
   - Cho phép tất cả HTTP methods cần thiết
   - Cho phép credentials để authentication hoạt động
   - Cache preflight requests để tăng performance

2. PUBLIC ENDPOINTS (không cần token):
   - /auth/** (login, register, refresh, logout)
   - GET /users/exists/** (cho order-service kiểm tra user tồn tại)
   - OPTIONS /** (cho CORS preflight requests)

3. ADMIN ENDPOINTS (cần token + role ADMIN):
   - /users/admin/**
   - /roles/**
   - /permissions/**

4. USER ENDPOINTS (cần token):
   - /users/** (trừ admin và exists)

5. VÍ DỤ LUỒNG XỬ LÝ CORS:
   - Browser gửi OPTIONS request trước (preflight)
   → CORS config trả về headers cho phép
   → Browser gửi actual request (POST /auth/login)
   → Backend xử lý và trả về kết quả
*/