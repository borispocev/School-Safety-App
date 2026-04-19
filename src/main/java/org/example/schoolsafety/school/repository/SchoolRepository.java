package org.example.schoolsafety.school.repository;

import org.example.schoolsafety.school.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolRepository extends JpaRepository<School, Long> {
}
