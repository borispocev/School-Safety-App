package org.example.schoolsafety.report.repository;

import org.example.schoolsafety.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

    java.util.List<Report> findAllByOrderBySubmittedAtDesc();
}
