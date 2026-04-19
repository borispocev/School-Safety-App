INSERT IGNORE INTO roles (name, description, created_at, updated_at)
VALUES
    ('ADMIN', 'System administrator with full access', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('USER', 'Standard authenticated user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO schools (name, address_line_1, address_line_2, city, state, postal_code, country, phone_number, email, created_at, updated_at)
SELECT 'School Safety Demo School', '123 Main Street', NULL, 'Skopje', NULL, '1000', 'North Macedonia', NULL, 'admin-school@schoolsafety.local', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM schools
    WHERE email = 'admin-school@schoolsafety.local'
);

INSERT INTO users (school_id, role_id, first_name, last_name, email, password_hash, active, created_at, updated_at)
SELECT s.id, r.id, 'System', 'Administrator', 'admin@schoolsafety.local', '$2a$10$fQLWrE2rF8jLkkQWZnx6yuDvuFqxA.1/n4GDX7gmmPt2aX1Gxtise', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM schools s
JOIN roles r ON r.name = 'ADMIN'
WHERE s.email = 'admin-school@schoolsafety.local'
  AND NOT EXISTS (
      SELECT 1
      FROM users
      WHERE email = 'admin@schoolsafety.local'
  );

INSERT IGNORE INTO report_statuses (code, name, description, display_order, created_at, updated_at)
VALUES
    ('SUBMITTED', 'Submitted', 'Report has been created and awaits review', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('IN_REVIEW', 'In Review', 'Report is being reviewed by staff', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('RESOLVED', 'Resolved', 'Report has been resolved', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('REJECTED', 'Rejected', 'Report was reviewed and rejected', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT IGNORE INTO report_types (code, name, description, anonymous_allowed, created_at, updated_at)
VALUES
    ('BULLYING', 'Bullying', 'Bullying or harassment related incident', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('VIOLENCE', 'Violence', 'Physical altercation or threat of violence', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('VANDALISM', 'Vandalism', 'Damage to school property', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('SUSPICIOUS_ACTIVITY', 'Suspicious Activity', 'Suspicious person or behavior on campus', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
