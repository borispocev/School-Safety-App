package org.example.schoolsafety.school.controller;

import jakarta.validation.Valid;
import org.example.schoolsafety.school.dto.SchoolRequest;
import org.example.schoolsafety.school.dto.SchoolResponse;
import org.example.schoolsafety.school.service.SchoolService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    private final SchoolService schoolService;

    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    public List<SchoolResponse> getSchools() {
        return schoolService.getAllSchools();
    }

    @GetMapping("/{id}")
    public SchoolResponse getSchool(@PathVariable Long id) {
        return schoolService.getSchoolById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SchoolResponse createSchool(@Valid @RequestBody SchoolRequest request) {
        return schoolService.createSchool(request);
    }

    @PutMapping("/{id}")
    public SchoolResponse updateSchool(@PathVariable Long id, @Valid @RequestBody SchoolRequest request) {
        return schoolService.updateSchool(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchool(@PathVariable Long id) {
        schoolService.deleteSchool(id);
    }
}
