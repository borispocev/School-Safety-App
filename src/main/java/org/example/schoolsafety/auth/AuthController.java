package org.example.schoolsafety.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public AuthUserResponse me(Authentication authentication) {
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        return new AuthUserResponse(
                principal.getId(),
                principal.getUsername(),
                principal.getFirstName(),
                principal.getLastName(),
                principal.getRoleName()
        );
    }
}
