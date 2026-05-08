package org.example.schoolsafety.auth;

import jakarta.validation.Valid;
import org.example.schoolsafety.user.dto.UserResponse;
import org.example.schoolsafety.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public AuthUserResponse me(Authentication authentication) {
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        return new AuthUserResponse(
                principal.getId(),
                principal.getUsername(),
                principal.getFirstName(),
                principal.getLastName(),
                principal.getRoleName(),
                principal.getSchoolId(),
                principal.getSchoolName()
        );
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/apply-student")
    public AuthUserResponse applyAsStudent(@Valid @RequestBody ApplyStudentRequest request,
                                           Authentication authentication) {
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        userService.assignSchool(principal.getId(), request.schoolId());
        // reload fresh data so the response reflects the new school
        UserResponse updated = userService.getUserById(principal.getId());
        return new AuthUserResponse(
                updated.id(),
                principal.getUsername(),
                updated.firstName(),
                updated.lastName(),
                updated.roleName(),
                updated.schoolId(),
                updated.schoolName()
        );
    }
}
