package org.example.schoolsafety.report.repository;

import org.example.schoolsafety.report.entity.ReportType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportTypeRepository extends JpaRepository<ReportType, Long> {

    Optional<ReportType> findByCode(String code);

    java.util.List<ReportType> findAllByOrderByNameAsc();
}
