package org.example.schoolsafety.user.dto;

public record UserResponse(
        Long id,
        Long schoolId,
        String schoolName,
        Long roleId,
        String roleName,
        String firstName,
        String lastName,
        String email,
        boolean active
) {
}
