package org.example.schoolsafety.report.controller;

import jakarta.validation.Valid;
import org.example.schoolsafety.report.dto.ReportImageRequest;
import org.example.schoolsafety.report.dto.ReportImageResponse;
import org.example.schoolsafety.report.service.ReportImageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports/{reportId}/images")
public class ReportImageController {

    private final ReportImageService reportImageService;

    public ReportImageController(ReportImageService reportImageService) {
        this.reportImageService = reportImageService;
    }

    @GetMapping
    public List<ReportImageResponse> getReportImages(@PathVariable Long reportId) {
        return reportImageService.getReportImages(reportId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReportImageResponse addReportImage(@PathVariable Long reportId,
                                              @Valid @RequestBody ReportImageRequest request) {
        return reportImageService.addReportImage(reportId, request);
    }
}
