package org.example.schoolsafety.report.service;

import org.example.schoolsafety.report.dto.ReportStatusResponse;
import org.example.schoolsafety.report.dto.ReportTypeResponse;
import org.example.schoolsafety.report.entity.ReportStatus;
import org.example.schoolsafety.report.entity.ReportType;
import org.example.schoolsafety.report.repository.ReportStatusRepository;
import org.example.schoolsafety.report.repository.ReportTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReportMetadataService {

    private final ReportStatusRepository reportStatusRepository;
    private final ReportTypeRepository reportTypeRepository;

    public ReportMetadataService(ReportStatusRepository reportStatusRepository,
                                 ReportTypeRepository reportTypeRepository) {
        this.reportStatusRepository = reportStatusRepository;
        this.reportTypeRepository = reportTypeRepository;
    }

    public List<ReportStatusResponse> getStatuses() {
        return reportStatusRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toStatusResponse)
                .toList();
    }

    public List<ReportTypeResponse> getTypes() {
        return reportTypeRepository.findAllByOrderByNameAsc().stream()
                .map(this::toTypeResponse)
                .toList();
    }

    private ReportStatusResponse toStatusResponse(ReportStatus reportStatus) {
        return new ReportStatusResponse(
                reportStatus.getId(),
                reportStatus.getCode(),
                reportStatus.getName(),
                reportStatus.getDescription(),
                reportStatus.getDisplayOrder()
        );
    }

    private ReportTypeResponse toTypeResponse(ReportType reportType) {
        return new ReportTypeResponse(
                reportType.getId(),
                reportType.getCode(),
                reportType.getName(),
                reportType.getDescription(),
                reportType.isAnonymousAllowed()
        );
    }
}
