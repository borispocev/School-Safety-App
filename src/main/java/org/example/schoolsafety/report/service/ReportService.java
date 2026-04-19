package org.example.schoolsafety.report.service;

import org.example.schoolsafety.common.exception.ResourceNotFoundException;
import org.example.schoolsafety.report.dto.ReportImageResponse;
import org.example.schoolsafety.report.dto.ReportRequest;
import org.example.schoolsafety.report.dto.ReportResponse;
import org.example.schoolsafety.report.entity.Report;
import org.example.schoolsafety.report.entity.ReportImage;
import org.example.schoolsafety.report.entity.ReportStatus;
import org.example.schoolsafety.report.entity.ReportType;
import org.example.schoolsafety.report.repository.ReportImageRepository;
import org.example.schoolsafety.report.repository.ReportRepository;
import org.example.schoolsafety.report.repository.ReportStatusRepository;
import org.example.schoolsafety.report.repository.ReportTypeRepository;
import org.example.schoolsafety.school.entity.School;
import org.example.schoolsafety.school.service.SchoolService;
import org.example.schoolsafety.user.entity.User;
import org.example.schoolsafety.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportStatusRepository reportStatusRepository;
    private final ReportTypeRepository reportTypeRepository;
    private final ReportImageRepository reportImageRepository;
    private final SchoolService schoolService;
    private final UserService userService;

    public ReportService(ReportRepository reportRepository,
                         ReportStatusRepository reportStatusRepository,
                         ReportTypeRepository reportTypeRepository,
                         ReportImageRepository reportImageRepository,
                         SchoolService schoolService,
                         UserService userService) {
        this.reportRepository = reportRepository;
        this.reportStatusRepository = reportStatusRepository;
        this.reportTypeRepository = reportTypeRepository;
        this.reportImageRepository = reportImageRepository;
        this.schoolService = schoolService;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long id) {
        return toResponse(getReportEntity(id));
    }

    public ReportResponse createReport(ReportRequest request) {
        Report report = new Report();
        applyRequest(report, request);
        return toResponse(reportRepository.save(report));
    }

    public ReportResponse updateReport(Long id, ReportRequest request) {
        Report report = getReportEntity(id);
        applyRequest(report, request);
        return toResponse(reportRepository.save(report));
    }

    public void deleteReport(Long id) {
        Report report = getReportEntity(id);
        reportRepository.delete(report);
    }

    public Report getReportEntity(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + id));
    }

    private void applyRequest(Report report, ReportRequest request) {
        School school = schoolService.getSchoolEntity(request.schoolId());
        ReportStatus status = reportStatusRepository.findById(request.reportStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Report status not found with id " + request.reportStatusId()));
        ReportType type = reportTypeRepository.findById(request.reportTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Report type not found with id " + request.reportTypeId()));
        User reporterUser = request.reporterUserId() == null ? null : userService.getUserEntity(request.reporterUserId());

        report.setSchool(school);
        report.setReporterUser(reporterUser);
        report.setReportStatus(status);
        report.setReportType(type);
        report.setTitle(request.title());
        report.setDescription(request.description());
        report.setLocationDetails(request.locationDetails());
        report.setAnonymousReport(request.anonymousReport());
        report.setIncidentAt(request.incidentAt());
        report.setSubmittedAt(request.submittedAt());
        report.setResolvedAt(request.resolvedAt());
    }

    private ReportResponse toResponse(Report report) {
        List<ReportImageResponse> images = reportImageRepository.findByReportId(report.getId()).stream()
                .map(this::toImageResponse)
                .toList();

        String reporterName = report.getReporterUser() == null
                ? null
                : report.getReporterUser().getFirstName() + " " + report.getReporterUser().getLastName();

        return new ReportResponse(
                report.getId(),
                report.getSchool().getId(),
                report.getSchool().getName(),
                report.getReporterUser() != null ? report.getReporterUser().getId() : null,
                reporterName,
                report.getReportStatus().getId(),
                report.getReportStatus().getName(),
                report.getReportType().getId(),
                report.getReportType().getName(),
                report.getTitle(),
                report.getDescription(),
                report.getLocationDetails(),
                report.isAnonymousReport(),
                report.getIncidentAt(),
                report.getSubmittedAt(),
                report.getResolvedAt(),
                images
        );
    }

    private ReportImageResponse toImageResponse(ReportImage reportImage) {
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
