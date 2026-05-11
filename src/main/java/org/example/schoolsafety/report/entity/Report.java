package org.example.schoolsafety.report.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.example.schoolsafety.common.entity.AuditableEntity;
import org.example.schoolsafety.school.entity.School;
import org.example.schoolsafety.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_user_id")
    private User reporterUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_status_id", nullable = false)
    private ReportStatus reportStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_type_id", nullable = false)
    private ReportType reportType;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_details", length = 255)
    private String locationDetails;

    @Column(name = "anonymous_report", nullable = false)
    private boolean anonymousReport;

    @Column(name = "incident_at")
    private LocalDateTime incidentAt;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "ai_suggested_type_code", length = 50)
    private String aiSuggestedTypeCode;

    @Column(name = "ai_suggested_type_name", length = 100)
    private String aiSuggestedTypeName;

    @Column(name = "ai_confidence_score")
    private Double aiConfidenceScore;

    @Column(name = "ai_suggested_priority", length = 30)
    private String aiSuggestedPriority;

    @Column(name = "ai_risk_keywords", length = 1000)
    private String aiRiskKeywords;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public User getReporterUser() {
        return reporterUser;
    }

    public void setReporterUser(User reporterUser) {
        this.reporterUser = reporterUser;
    }

    public ReportStatus getReportStatus() {
        return reportStatus;
    }

    public void setReportStatus(ReportStatus reportStatus) {
        this.reportStatus = reportStatus;
    }

    public ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(String locationDetails) {
        this.locationDetails = locationDetails;
    }

    public boolean isAnonymousReport() {
        return anonymousReport;
    }

    public void setAnonymousReport(boolean anonymousReport) {
        this.anonymousReport = anonymousReport;
    }

    public LocalDateTime getIncidentAt() {
        return incidentAt;
    }

    public void setIncidentAt(LocalDateTime incidentAt) {
        this.incidentAt = incidentAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getAiSuggestedTypeCode() {
        return aiSuggestedTypeCode;
    }

    public void setAiSuggestedTypeCode(String aiSuggestedTypeCode) {
        this.aiSuggestedTypeCode = aiSuggestedTypeCode;
    }

    public String getAiSuggestedTypeName() {
        return aiSuggestedTypeName;
    }

    public void setAiSuggestedTypeName(String aiSuggestedTypeName) {
        this.aiSuggestedTypeName = aiSuggestedTypeName;
    }

    public Double getAiConfidenceScore() {
        return aiConfidenceScore;
    }

    public void setAiConfidenceScore(Double aiConfidenceScore) {
        this.aiConfidenceScore = aiConfidenceScore;
    }
    public String getAiSuggestedPriority() {
        return aiSuggestedPriority;
    }

    public void setAiSuggestedPriority(String aiSuggestedPriority) {
        this.aiSuggestedPriority = aiSuggestedPriority;
    }

    public String getAiRiskKeywords() {
        return aiRiskKeywords;
    }

    public void setAiRiskKeywords(String aiRiskKeywords) {
        this.aiRiskKeywords = aiRiskKeywords;
    }
    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
