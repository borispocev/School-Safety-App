package org.example.schoolsafety.report.service;

import org.example.schoolsafety.report.dto.ReportImageRequest;
import org.example.schoolsafety.report.dto.ReportImageResponse;
import org.example.schoolsafety.report.entity.Report;
import org.example.schoolsafety.report.entity.ReportImage;
import org.example.schoolsafety.report.repository.ReportImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReportImageService {

    private final ReportImageRepository reportImageRepository;
    private final ReportService reportService;

    public ReportImageService(ReportImageRepository reportImageRepository, ReportService reportService) {
        this.reportImageRepository = reportImageRepository;
        this.reportService = reportService;
    }

    @Transactional(readOnly = true)
    public List<ReportImageResponse> getReportImages(Long reportId) {
        reportService.getReportEntity(reportId);
        return reportImageRepository.findByReportId(reportId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ReportImageResponse addReportImage(Long reportId, ReportImageRequest request) {
        Report report = reportService.getReportEntity(reportId);
        ReportImage reportImage = new ReportImage();
        reportImage.setReport(report);
        reportImage.setImageUrl(request.imageUrl());
        reportImage.setFileName(request.fileName());
        reportImage.setContentType(request.contentType());
        reportImage.setFileSize(request.fileSize());
        reportImage.setUploadedAt(LocalDateTime.now());
        return toResponse(reportImageRepository.save(reportImage));
    }

    private ReportImageResponse toResponse(ReportImage reportImage) {
        return new ReportImageResponse(
                reportImage.getId(),
                reportImage.getReport().getId(),
                reportImage.getImageUrl(),
                reportImage.getFileName(),
                reportImage.getContentType(),
                reportImage.getFileSize(),
                reportImage.getUploadedAt()
        );
    }
}
