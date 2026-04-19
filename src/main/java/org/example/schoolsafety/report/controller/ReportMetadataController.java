package org.example.schoolsafety.report.controller;

import org.example.schoolsafety.report.dto.ReportStatusResponse;
import org.example.schoolsafety.report.dto.ReportTypeResponse;
import org.example.schoolsafety.report.service.ReportMetadataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/report-metadata")
public class ReportMetadataController {

    private final ReportMetadataService reportMetadataService;

    public ReportMetadataController(ReportMetadataService reportMetadataService) {
        this.reportMetadataService = reportMetadataService;
    }

    @GetMapping("/statuses")
    public List<ReportStatusResponse> getStatuses() {
        return reportMetadataService.getStatuses();
    }

    @GetMapping("/types")
    public List<ReportTypeResponse> getTypes() {
        return reportMetadataService.getTypes();
    }
}
