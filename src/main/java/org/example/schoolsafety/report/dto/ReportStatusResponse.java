package org.example.schoolsafety.report.dto;

public record ReportStatusResponse(
        Long id,
        String code,
        String name,
        String description,
        Integer displayOrder
) {
}
