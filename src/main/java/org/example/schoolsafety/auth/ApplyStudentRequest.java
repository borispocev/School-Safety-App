package org.example.schoolsafety.auth;

import jakarta.validation.constraints.NotNull;

public record ApplyStudentRequest(@NotNull Long schoolId) {
}
