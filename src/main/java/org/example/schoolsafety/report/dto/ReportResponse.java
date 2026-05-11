package org.example.schoolsafety.report.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ReportResponse(
        Long id,
        Long schoolId,
        String schoolName,
        Long reporterUserId,
        String reporterName,
        Long reportStatusId,
        String reportStatusName,
        Long reportTypeId,
        String reportTypeName,
        String title,
        String description,
        String locationDetails,
        boolean anonymousReport,
        LocalDateTime incidentAt,
        LocalDateTime submittedAt,
        LocalDateTime resolvedAt,
        List<ReportImageResponse> images,
        String aiSuggestedTypeCode,
        String aiSuggestedTypeName,
        Double aiConfidenceScore,
        String aiSuggestedPriority,
        String aiRiskKeywords,
        Double latitude,
        Double longitude
) {
}
