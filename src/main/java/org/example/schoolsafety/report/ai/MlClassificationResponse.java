package org.example.schoolsafety.report.ai;

import java.util.List;

public record MlClassificationResponse(
        String predictedTypeCode,
        String predictedTypeName,
        Double confidenceScore,
        String suggestedPriority,
        List<String> riskKeywords
) {
}