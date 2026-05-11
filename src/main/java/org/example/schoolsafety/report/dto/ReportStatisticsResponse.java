package org.example.schoolsafety.report.dto;

import java.util.List;

public record ReportStatisticsResponse(
        Long totalReports,
        List<ReportStatisticItem> byType,
        List<ReportStatisticItem> byStatus,
        List<ReportStatisticItem> bySchool
) {
}