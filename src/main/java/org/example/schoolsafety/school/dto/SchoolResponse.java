package org.example.schoolsafety.school.dto;

public record SchoolResponse(
        Long id,
        String name,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String postalCode,
        String country,
        String phoneNumber,
        String email
) {
}
