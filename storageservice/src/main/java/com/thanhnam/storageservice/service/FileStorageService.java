package com.thanhnam.storageservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final Path storageLocation;

    public FileStorageService(@Value("${storage.upload-dir:uploads}") String storageDir) {
        this.storageLocation = Paths.get(storageDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.storageLocation);
            log.info("Storage directory initialized: {}", this.storageLocation);
        } catch (Exception e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    /**
     * Lưu file và trả về tên file unique
     */
    public String storeFile(MultipartFile file) {
        validateFile(file);

        try {
            // Tạo tên file unique
            String uniqueFilename = generateUniqueFilename(file.getOriginalFilename());

            // Copy file vào storage
            Path targetLocation = this.storageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("File stored successfully: {} -> {}", file.getOriginalFilename(), uniqueFilename);

            return uniqueFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    /**
     * Lấy đường dẫn file
     */
    public Path getFilePath(String filename) {
        return this.storageLocation.resolve(filename).normalize();
    }

    /**
     * Kiểm tra file có tồn tại không
     */
    public boolean fileExists(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }
        Path filePath = getFilePath(filename);
        return Files.exists(filePath);
    }

    /**
     * Xóa file
     */
    public void deleteFile(String filename) {
        try {
            Path filePath = getFilePath(filename);
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("File deleted successfully: {}", filename);
            } else {
                log.warn("File not found for deletion: {}", filename);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + filename, e);
        }
    }

    /**
     * Lấy danh sách tất cả files trong thư mục
     */
    public List<String> getAllFiles() {
        try {
            return Files.list(storageLocation)
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .sorted()
                    .toList();
        } catch (IOException e) {
            log.error("Error listing files", e);
            return List.of();
        }
    }

    /**
     * Validate file
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Check file size (max 10MB)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB");
        }

        // Check file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = getFileExtension(originalFilename).toLowerCase();
            List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "gif", "webp", "bmp", "pdf", "doc", "docx", "txt");
            if (!allowedExtensions.contains(extension)) {
                throw new RuntimeException("File extension not allowed: " + extension);
            }
        } else {
            throw new RuntimeException("Original filename is null");
        }

        // Check for malicious filename patterns
        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new RuntimeException("Invalid filename pattern detected");
        }
    }

    /**
     * Tạo tên file unique
     */
    private String generateUniqueFilename(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String baseName = getBaseName(originalFilename);

        // Tạo timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        // Tạo UUID ngắn
        String uuid = UUID.randomUUID().toString().substring(0, 8);

        // Format: baseName_timestamp_uuid.extension
        String uniqueName = String.format("%s_%s_%s.%s", baseName, timestamp, uuid, extension);

        // Đảm bảo filename unique trên disk
        String finalName = uniqueName;
        int counter = 1;
        while (Files.exists(this.storageLocation.resolve(finalName))) {
            finalName = String.format("%s_%s_%s_(%d).%s", baseName, timestamp, uuid, counter, extension);
            counter++;
        }

        return finalName;
    }

    /**
     * Lấy file extension
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex == -1 ? "" : filename.substring(lastDotIndex + 1);
    }

    /**
     * Lấy base name (không có extension)
     */
    private String getBaseName(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex == -1 ? filename : filename.substring(0, lastDotIndex);
    }
}