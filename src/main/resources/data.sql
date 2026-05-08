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

-- Secondary schools in Skopje (skopje.gov.mk/mk/skopje/sredni-ucilista/)
INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Никола Карев', 'ул. Никола Русински бр. 2', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Никола Карев');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Раде Јовчевски - Корчагин', 'ул. Трета македонска ударна бригада број 9', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Раде Јовчевски - Корчагин');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Јосип Броз Тито', 'ул. Димитрие Чуповски 27', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Јосип Броз Тито');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Михајло Пупин', 'ул. Благоја Стефковски бб', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Михајло Пупин');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Боро Петрушевски', 'бул. Александар Македонски број 26 Б', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Боро Петрушевски');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Орце Николов', 'Булевар Илинден бр. 101', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Орце Николов');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Кочо Рацин', 'ул. Лихнида бр. 3', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Кочо Рацин');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Панче Арсовски', 'ул. 16-та Македонска бригада бр. 34', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Панче Арсовски');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Георги Димитров', 'ул. Варшавска бр. 3', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Георги Димитров');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Васил Антевски - Дрен', 'ул. Вера Јоциќ бб', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Васил Антевски - Дрен');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Марија Кири Склодовска', 'ул. Трета Македонска бригада број 63 А', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Марија Кири Склодовска');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Владо Тасевски', 'ул. Трета Македонска Бригада бб', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Владо Тасевски');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Димитар Влахов', 'ул. Трета Македонска Бригада број 22', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Димитар Влахов');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Браќа Миладиновци', 'ул. Бранко Заревски бр. 110', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Браќа Миладиновци');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Здравко Цветковски', 'бул. Партизански одреди број 91', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Здравко Цветковски');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Арсени Јовков', 'ул. Костурска бб', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Арсени Јовков');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Лазар Танев', 'ул. Стрезово бр. 3', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Лазар Танев');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ 8 Септември', 'бул. Александар Македонски број 24', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ 8 Септември');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Цветан Димов', 'ул. Џон Кенеди 16', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Цветан Димов');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Д-р Панче Караѓозов', 'ул. 50-та Дивизија бр. 2а', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Д-р Панче Караѓозов');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Зеф Љуш Марку', 'ул. Лазо Трповски бб', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Зеф Љуш Марку');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Сарај', 'ул. 2 бр. 20', 'Сарај', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Сарај');

INSERT INTO schools (name, address_line_1, city, country, created_at, updated_at)
SELECT 'СОУ Шаип Јусуф', 'ул. Вашингтонска бр. 44', 'Скопје', 'Македонија', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'СОУ Шаип Јусуф');
