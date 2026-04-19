package org.example.schoolsafety.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportImageRequest(
        @NotBlank @Size(max = 500) String imageUrl,
        @NotBlank @Size(max = 255) String fileName,
        @NotBlank @Size(max = 100) String contentType,
        @NotNull Long fileSize
) {
}
