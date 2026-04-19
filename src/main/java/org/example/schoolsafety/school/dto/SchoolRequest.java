package org.example.schoolsafety.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SchoolRequest(
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 150) String addressLine1,
        @Size(max = 150) String addressLine2,
        @NotBlank @Size(max = 100) String city,
        @Size(max = 100) String state,
        @Size(max = 20) String postalCode,
        @NotBlank @Size(max = 100) String country,
        @Size(max = 30) String phoneNumber,
        @Email @Size(max = 150) String email
) {
}
