package org.example.schoolsafety.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/apply-student").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/schools/**").permitAll()
                        .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/roles/**", "/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/schools/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reports/export/csv").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reports/statistics").hasRole("ADMIN")
                        .requestMatchers("/api/reports/*/images/**", "/api/report-metadata/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reports/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/reports/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/reports/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/reports/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .httpBasic(basic -> basic.authenticationEntryPoint(
                        (request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"status\":401,\"message\":\"Unauthorized\"}");
                        }
                ));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
