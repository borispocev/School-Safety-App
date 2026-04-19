package org.example.schoolsafety.auth;

import org.example.schoolsafety.role.entity.Role;
import org.example.schoolsafety.role.repository.RoleRepository;
import org.example.schoolsafety.school.entity.School;
import org.example.schoolsafety.school.repository.SchoolRepository;
import org.example.schoolsafety.user.entity.User;
import org.example.schoolsafety.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        School school = schoolRepository.findAll().stream()
                .findFirst()
                .orElseGet(this::createSchool);

        upsertUser("admin@schoolsafety.test", "ADMIN", school, "Admin", "User");
        upsertUser("user@schoolsafety.test", "USER", school, "Regular", "User");
    }

    @Test
    void meEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void userCanAccessOwnIdentity() throws Exception {
        mockMvc.perform(get("/api/auth/me").with(httpBasic("user@schoolsafety.test", "Password123!")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@schoolsafety.test"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void userCannotAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/users").with(httpBasic("user@schoolsafety.test", "Password123!")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/users").with(httpBasic("admin@schoolsafety.test", "Password123!")))
                .andExpect(status().isOk());
    }

    private School createSchool() {
        School school = new School();
        school.setName("Security Test School");
        school.setAddressLine1("123 Test Street");
        school.setCity("Skopje");
        school.setCountry("North Macedonia");
        school.setEmail("school@test.local");
        return schoolRepository.save(school);
    }

    private void upsertUser(String email, String roleName, School school, String firstName, String lastName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Missing role " + roleName));

        Optional<User> existing = userRepository.findByEmail(email);
        User user = existing.orElseGet(User::new);
        user.setSchool(school);
        user.setRole(role);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("Password123!"));
        user.setActive(true);
        userRepository.save(user);
    }
}
