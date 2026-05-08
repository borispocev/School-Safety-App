package org.example.schoolsafety.auth;

import org.example.schoolsafety.user.entity.User;
import org.example.schoolsafety.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DatabaseUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email " + username));

        Long schoolId = user.getSchool() != null ? user.getSchool().getId() : null;
        String schoolName = user.getSchool() != null ? user.getSchool().getName() : null;

        return new AuthenticatedUser(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.isActive(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().getName(),
                schoolId,
                schoolName
        );
    }
}
