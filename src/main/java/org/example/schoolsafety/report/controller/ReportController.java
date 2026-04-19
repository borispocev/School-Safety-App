package org.example.schoolsafety.report.controller;

import jakarta.validation.Valid;
import org.example.schoolsafety.report.dto.ReportRequest;
import org.example.schoolsafety.report.dto.ReportResponse;
import org.example.schoolsafety.report.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReportResponse> getReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{id}")
    public ReportResponse getReport(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReportResponse createReport(@Valid @RequestBody ReportRequest request) {
        return reportService.createReport(request);
    }

    @PutMapping("/{id}")
    public ReportResponse updateReport(@PathVariable Long id, @Valid @RequestBody ReportRequest request) {
        return reportService.updateReport(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
    }
}
