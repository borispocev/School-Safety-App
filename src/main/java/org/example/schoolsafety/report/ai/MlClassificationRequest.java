package org.example.schoolsafety.report.ai;

public record MlClassificationRequest(
        String title,
        String description,
        String locationDetails
) {
}
