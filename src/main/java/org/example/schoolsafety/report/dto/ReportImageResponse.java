package org.example.schoolsafety.report.dto;

import java.time.LocalDateTime;

public record ReportImageResponse(
        Long id,
        Long reportId,
        String imageUrl,
        String fileName,
        String contentType,
        Long fileSize,
        LocalDateTime uploadedAt
) {
}
