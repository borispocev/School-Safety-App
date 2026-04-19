package org.example.schoolsafety.user.service;

import org.example.schoolsafety.common.exception.ConflictException;
import org.example.schoolsafety.common.exception.ResourceNotFoundException;
import org.example.schoolsafety.role.entity.Role;
import org.example.schoolsafety.role.repository.RoleRepository;
import org.example.schoolsafety.school.entity.School;
import org.example.schoolsafety.school.service.SchoolService;
import org.example.schoolsafety.user.dto.UserRequest;
import org.example.schoolsafety.user.dto.UserResponse;
import org.example.schoolsafety.user.dto.UserUpdateRequest;
import org.example.schoolsafety.user.entity.User;
import org.example.schoolsafety.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SchoolService schoolService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       SchoolService schoolService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.schoolService = schoolService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return toResponse(getUserEntity(id));
    }

    public UserResponse createUser(UserRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(existingUser -> {
            throw new ConflictException("A user with email " + request.email() + " already exists");
        });

        User user = new User();
        applyRequest(user, request.schoolId(), request.roleId(), request.firstName(), request.lastName(),
                request.email(), request.password(), request.active(), true);
        return toResponse(userRepository.save(user));
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = getUserEntity(id);

        userRepository.findByEmail(request.email())
                .filter(existingUser -> !existingUser.getId().equals(id))
                .ifPresent(existingUser -> {
                    throw new ConflictException("A user with email " + request.email() + " already exists");
                });

        applyRequest(user, request.schoolId(), request.roleId(), request.firstName(), request.lastName(),
                request.email(), request.password(), request.active(), false);
        return toResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = getUserEntity(id);
        userRepository.delete(user);
    }

    public User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    private void applyRequest(User user,
                              Long schoolId,
                              Long roleId,
                              String firstName,
                              String lastName,
                              String email,
                              String password,
                              boolean active,
                              boolean passwordRequired) {
        School school = schoolService.getSchoolEntity(schoolId);
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id " + roleId));

        user.setSchool(school);
        user.setRole(role);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setActive(active);

        if (passwordRequired || (password != null && !password.isBlank())) {
            user.setPasswordHash(passwordEncoder.encode(password));
        }
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getSchool().getId(),
                user.getSchool().getName(),
                user.getRole().getId(),
                user.getRole().getName(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.isActive()
        );
    }
}
