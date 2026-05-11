package org.example.schoolsafety.report.repository;

import org.example.schoolsafety.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    java.util.List<Report> findAllByOrderBySubmittedAtDesc();

    @Query("""
            select rt.name, count(r.id)
            from Report r
            join r.reportType rt
            group by rt.name
            order by count(r.id) desc
            """)
    List<Object[]> countReportsByType();

    @Query("""
            select rs.name, count(r.id)
            from Report r
            join r.reportStatus rs
            group by rs.name
            order by count(r.id) desc
            """)
    List<Object[]> countReportsByStatus();

    @Query("""
            select s.name, count(r.id)
            from Report r
            join r.school s
            group by s.name
            order by count(r.id) desc
            """)
    List<Object[]> countReportsBySchool();
}
