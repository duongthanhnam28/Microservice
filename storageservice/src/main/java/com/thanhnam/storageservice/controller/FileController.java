package com.thanhnam.storageservice.controller;

import com.thanhnam.storageservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * Upload file - trả về tên file
     */
    @PostMapping("/upload")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String filename = fileStorageService.storeFile(file);
            return Map.of(
                    "success", true,
                    "message", "File uploaded successfully",
                    "filename", filename,
                    "originalFilename", file.getOriginalFilename(),
                    "fileSize", file.getSize(),
                    "fileUrl", "/api/files/" + filename
            );
        } catch (Exception e) {
            log.error("Upload failed", e);
            return Map.of(
                    "success", false,
                    "message", "Upload failed: " + e.getMessage()
            );
        }
    }

    /**
     * Lấy file theo tên
     */
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            // Security check
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            Path path = fileStorageService.getFilePath(filename);
            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(path.toUri());

            // Auto-detect content-type
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            log.error("Invalid file URL", e);
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("IO error", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Lấy danh sách tất cả files
     */
    @GetMapping
    public Map<String, Object> listFiles() {
        try {
            List<String> files = fileStorageService.getAllFiles();
            return Map.of(
                    "success", true,
                    "files", files,
                    "count", files.size()
            );
        } catch (Exception e) {
            log.error("Error listing files", e);
            return Map.of(
                    "success", false,
                    "message", "Error listing files: " + e.getMessage()
            );
        }
    }

    /**
     * Xóa file
     */
    @DeleteMapping("/{filename}")
    public Map<String, Object> deleteFile(@PathVariable String filename) {
        try {
            if (!fileStorageService.fileExists(filename)) {
                return Map.of(
                        "success", false,
                        "message", "File not found: " + filename
                );
            }

            fileStorageService.deleteFile(filename);
            return Map.of(
                    "success", true,
                    "message", "File deleted successfully"
            );
        } catch (Exception e) {
            log.error("Delete failed", e);
            return Map.of(
                    "success", false,
                    "message", "Delete failed: " + e.getMessage()
            );
        }
    }

    /**
     * Kiểm tra file có tồn tại
     */
    @GetMapping("/exists/{filename}")
    public Map<String, Object> checkFileExists(@PathVariable String filename) {
        boolean exists = fileStorageService.fileExists(filename);
        return Map.of(
                "exists", exists,
                "filename", filename
        );
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "File Storage Service",
                "timestamp", System.currentTimeMillis()
        );
    }
}