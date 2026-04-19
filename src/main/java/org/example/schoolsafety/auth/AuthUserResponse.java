package org.example.schoolsafety.auth;

public record AuthUserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String role
) {
}
