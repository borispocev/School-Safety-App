package org.example.schoolsafety.report.dto;

public record ReportTypeResponse(
        Long id,
        String code,
        String name,
        String description,
        boolean anonymousAllowed
) {
}
