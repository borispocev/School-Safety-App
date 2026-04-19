package org.example.schoolsafety.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record ReportRequest(
        @NotNull Long schoolId,
        Long reporterUserId,
        @NotNull Long reportStatusId,
        @NotNull Long reportTypeId,
        @NotBlank @Size(max = 150) String title,
        @NotBlank String description,
        @Size(max = 255) String locationDetails,
        boolean anonymousReport,
        LocalDateTime incidentAt,
        @NotNull LocalDateTime submittedAt,
        LocalDateTime resolvedAt
) {
}
