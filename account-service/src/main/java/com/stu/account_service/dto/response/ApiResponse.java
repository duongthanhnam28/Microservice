package com.stu.account_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.stu.account_service.exception.ErrorCode;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private int code = 1000; // thành công
    private String message;
    private T result;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    // Optional fields for debugging
    private String path;
//    private String correlationId;
//    private String details;

//    // Success response factory methods
//    public static <T> ApiResponse<T> success(T data) {
//        return ApiResponse.<T>builder()
//                .success(true)
//                .code(200)
//                .message("Success")
//                .data(data)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }
//
//    public static <T> ApiResponse<T> success(String message, T data) {
//        return ApiResponse.<T>builder()
//                .success(true)
//                .code(200)
//                .message(message)
//                .data(data)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }
//
//    // Error response factory methods
//    public static <T> ApiResponse<T> error(int code, String message) {
//        return ApiResponse.<T>builder()
//                .success(false)
//                .code(code)
//                .message(message)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }
//
//    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
//        return ApiResponse.<T>builder()
//                .success(false)
//                .code(errorCode.getCode())
//                .message(errorCode.getMessage())
//                .timestamp(LocalDateTime.now())
//                .build();
//    }
//
//    public static <T> ApiResponse<T> error(ErrorCode errorCode, String customMessage) {
//        return ApiResponse.<T>builder()
//                .success(false)
//                .code(errorCode.getCode())
//                .message(customMessage)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }
}