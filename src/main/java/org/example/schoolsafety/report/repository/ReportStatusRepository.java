package org.example.schoolsafety.report.repository;

import org.example.schoolsafety.report.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportStatusRepository extends JpaRepository<ReportStatus, Long> {

    Optional<ReportStatus> findByCode(String code);

    java.util.List<ReportStatus> findAllByOrderByDisplayOrderAsc();
}
