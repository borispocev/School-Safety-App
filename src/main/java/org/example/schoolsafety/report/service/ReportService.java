package org.example.schoolsafety.report.service;

import org.example.schoolsafety.common.exception.ResourceNotFoundException;
import org.example.schoolsafety.report.ai.MlClassificationResponse;
import org.example.schoolsafety.report.ai.MlReportClassifierService;
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
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import org.example.schoolsafety.report.dto.ReportStatisticItem;
import org.example.schoolsafety.report.dto.ReportStatisticsResponse;
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
    private final MlReportClassifierService mlReportClassifierService;

    public ReportService(ReportRepository reportRepository,
                         ReportStatusRepository reportStatusRepository,
                         ReportTypeRepository reportTypeRepository,
                         ReportImageRepository reportImageRepository,
                         SchoolService schoolService,
                         UserService userService,
                         MlReportClassifierService mlReportClassifierService) {
        this.reportRepository = reportRepository;
        this.reportStatusRepository = reportStatusRepository;
        this.reportTypeRepository = reportTypeRepository;
        this.reportImageRepository = reportImageRepository;
        this.schoolService = schoolService;
        this.userService = userService;
        this.mlReportClassifierService = mlReportClassifierService;
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
        applyMlClassification(report, request);

        Report savedReport = reportRepository.save(report);
        return toResponse(savedReport);
    }

    public ReportResponse updateReport(Long id, ReportRequest request) {
        Report report = getReportEntity(id);
        applyRequest(report, request);
        applyMlClassification(report, request);

        Report savedReport = reportRepository.save(report);
        return toResponse(savedReport);
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
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Report status not found with id " + request.reportStatusId()
                ));

        ReportType type = reportTypeRepository.findById(request.reportTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Report type not found with id " + request.reportTypeId()
                ));

        User reporterUser = request.reporterUserId() == null
                ? null
                : userService.getUserEntity(request.reporterUserId());

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

    private void applyMlClassification(Report report, ReportRequest request) {
        try {
            MlClassificationResponse classification = mlReportClassifierService.classify(
                    request.title(),
                    request.description(),
                    request.locationDetails()
            );

            if (classification != null) {
                report.setAiSuggestedTypeCode(classification.predictedTypeCode());
                report.setAiSuggestedTypeName(classification.predictedTypeName());
                report.setAiConfidenceScore(classification.confidenceScore());
                report.setAiSuggestedPriority(classification.suggestedPriority());

                if (classification.riskKeywords() != null) {
                    report.setAiRiskKeywords(String.join(", ", classification.riskKeywords()));
                } else {
                    report.setAiRiskKeywords(null);
                }
            }
        } catch (Exception exception) {
            report.setAiSuggestedTypeCode(null);
            report.setAiSuggestedTypeName(null);
            report.setAiConfidenceScore(null);
            report.setAiSuggestedPriority(null);
            report.setAiRiskKeywords(null);
        }
    }

    private ReportResponse toResponse(Report report) {
        List<ReportImageResponse> images = reportImageRepository.findByReportId(report.getId()).stream()
                .map(this::toImageResponse)
                .toList();

        String reporterName = report.getReporterUser() == null || report.isAnonymousReport()
                ? null
                : report.getReporterUser().getFirstName() + " " + report.getReporterUser().getLastName();

        Long reporterUserId = report.getReporterUser() == null || report.isAnonymousReport()
                ? null
                : report.getReporterUser().getId();

        return new ReportResponse(
                report.getId(),
                report.getSchool().getId(),
                report.getSchool().getName(),
                reporterUserId,
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
                images,
                report.getAiSuggestedTypeCode(),
                report.getAiSuggestedTypeName(),
                report.getAiConfidenceScore(),
                report.getAiSuggestedPriority(),
                report.getAiRiskKeywords()
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
    @Transactional(readOnly = true)
    public void exportReportsToCsv(PrintWriter writer) {
        List<Report> reports = reportRepository.findAllByOrderBySubmittedAtDesc();

        writer.println(String.join(",",
                "ID",
                "Title",
                "Description",
                "School",
                "Location",
                "User Selected Type",
                "Status",
                "Reporter",
                "Anonymous",
                "Incident At",
                "Submitted At",
                "Resolved At",
                "AI Suggested Type",
                "AI Confidence Score",
                "AI Suggested Priority",
                "AI Risk Keywords"
        ));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (Report report : reports) {
            String reporterName = report.getReporterUser() == null || report.isAnonymousReport()
                    ? ""
                    : report.getReporterUser().getFirstName() + " " + report.getReporterUser().getLastName();

            writer.println(String.join(",",
                    csvValue(report.getId()),
                    csvValue(report.getTitle()),
                    csvValue(report.getDescription()),
                    csvValue(report.getSchool() != null ? report.getSchool().getName() : null),
                    csvValue(report.getLocationDetails()),
                    csvValue(report.getReportType() != null ? report.getReportType().getName() : null),
                    csvValue(report.getReportStatus() != null ? report.getReportStatus().getName() : null),
                    csvValue(reporterName),
                    csvValue(report.isAnonymousReport()),
                    csvValue(report.getIncidentAt() != null ? report.getIncidentAt().format(formatter) : null),
                    csvValue(report.getSubmittedAt() != null ? report.getSubmittedAt().format(formatter) : null),
                    csvValue(report.getResolvedAt() != null ? report.getResolvedAt().format(formatter) : null),
                    csvValue(report.getAiSuggestedTypeName()),
                    csvValue(report.getAiConfidenceScore()),
                    csvValue(report.getAiSuggestedPriority()),
                    csvValue(report.getAiRiskKeywords())
            ));
        }

        writer.flush();
    }
    private String csvValue(Object value) {
        if (value == null) {
            return "\"\"";
        }

        String text = value.toString()
                .replace("\"", "\"\"")
                .replace("\n", " ")
                .replace("\r", " ");

        return "\"" + text + "\"";
    }
    @Transactional(readOnly = true)
    public ReportStatisticsResponse getReportStatistics() {
        Long totalReports = reportRepository.count();

        return new ReportStatisticsResponse(
                totalReports,
                mapStatistics(reportRepository.countReportsByType()),
                mapStatistics(reportRepository.countReportsByStatus()),
                mapStatistics(reportRepository.countReportsBySchool())
        );
    }

    private List<ReportStatisticItem> mapStatistics(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new ReportStatisticItem(
                        row[0] != null ? row[0].toString() : "Unknown",
                        row[1] != null ? ((Number) row[1]).longValue() : 0L
                ))
                .toList();
    }
}