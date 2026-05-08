package org.example.schoolsafety.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

public class AuthenticatedUser extends User {

    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String roleName;
    private final Long schoolId;
    private final String schoolName;

    public AuthenticatedUser(Long id,
                             String username,
                             String password,
                             boolean enabled,
                             String firstName,
                             String lastName,
                             String roleName,
                             Long schoolId,
                             String schoolName) {
        super(username, password, enabled, true, true, true, authoritiesFor(roleName));
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleName = roleName;
        this.schoolId = schoolId;
        this.schoolName = schoolName;
    }

    private static List<GrantedAuthority> authoritiesFor(String roleName) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRoleName() { return roleName; }
    public Long getSchoolId() { return schoolId; }
    public String getSchoolName() { return schoolName; }
}
