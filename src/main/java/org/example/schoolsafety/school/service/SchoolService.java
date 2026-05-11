package org.example.schoolsafety.school.service;

import org.example.schoolsafety.common.exception.ResourceNotFoundException;
import org.example.schoolsafety.school.dto.SchoolRequest;
import org.example.schoolsafety.school.dto.SchoolResponse;
import org.example.schoolsafety.school.entity.School;
import org.example.schoolsafety.school.repository.SchoolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public SchoolService(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    @Transactional(readOnly = true)
    public List<SchoolResponse> getAllSchools() {
        return schoolRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SchoolResponse getSchoolById(Long id) {
        return toResponse(getSchoolEntity(id));
    }

    public SchoolResponse createSchool(SchoolRequest request) {
        School school = new School();
        applyRequest(school, request);
        return toResponse(schoolRepository.save(school));
    }

    public SchoolResponse updateSchool(Long id, SchoolRequest request) {
        School school = getSchoolEntity(id);
        applyRequest(school, request);
        return toResponse(schoolRepository.save(school));
    }

    public void deleteSchool(Long id) {
        School school = getSchoolEntity(id);
        schoolRepository.delete(school);
    }

    public School getSchoolEntity(Long id) {
        return schoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id " + id));
    }

    private void applyRequest(School school, SchoolRequest request) {
        school.setName(request.name());
        school.setAddressLine1(request.addressLine1());
        school.setAddressLine2(request.addressLine2());
        school.setCity(request.city());
        school.setState(request.state());
        school.setPostalCode(request.postalCode());
        school.setCountry(request.country());
        school.setPhoneNumber(request.phoneNumber());
        school.setEmail(request.email());
    }

    private SchoolResponse toResponse(School school) {
        return new SchoolResponse(
                school.getId(),
                school.getName(),
                school.getAddressLine1(),
                school.getAddressLine2(),
                school.getCity(),
                school.getState(),
                school.getPostalCode(),
                school.getCountry(),
                school.getPhoneNumber(),
                school.getEmail(),
                school.getLatitude(),
                school.getLongitude()
        );
    }
}
