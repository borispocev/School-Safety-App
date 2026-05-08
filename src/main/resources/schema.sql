CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_roles_name UNIQUE (name)
);

CREATE TABLE schools (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    address_line_1 VARCHAR(150) NOT NULL,
    address_line_2 VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30),
    email VARCHAR(150),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE report_statuses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    display_order INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_report_statuses_code UNIQUE (code),
    CONSTRAINT uk_report_statuses_name UNIQUE (name)
);

CREATE TABLE report_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    anonymous_allowed BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_report_types_code UNIQUE (code),
    CONSTRAINT uk_report_types_name UNIQUE (name)
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NULL,
    role_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT fk_users_school FOREIGN KEY (school_id) REFERENCES schools (id),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL,
    reporter_user_id BIGINT,
    report_status_id BIGINT NOT NULL,
    report_type_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location_details VARCHAR(255),
    anonymous_report BOOLEAN NOT NULL,
    incident_at TIMESTAMP,
    submitted_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_reports_school FOREIGN KEY (school_id) REFERENCES schools (id),
    CONSTRAINT fk_reports_reporter_user FOREIGN KEY (reporter_user_id) REFERENCES users (id),
    CONSTRAINT fk_reports_status FOREIGN KEY (report_status_id) REFERENCES report_statuses (id),
    CONSTRAINT fk_reports_type FOREIGN KEY (report_type_id) REFERENCES report_types (id)
);

CREATE TABLE report_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_report_images_report FOREIGN KEY (report_id) REFERENCES reports (id)
);

CREATE INDEX idx_users_school_id ON users (school_id);
CREATE INDEX idx_users_role_id ON users (role_id);
CREATE INDEX idx_reports_school_id ON reports (school_id);
CREATE INDEX idx_reports_reporter_user_id ON reports (reporter_user_id);
CREATE INDEX idx_reports_status_id ON reports (report_status_id);
CREATE INDEX idx_reports_type_id ON reports (report_type_id);
CREATE INDEX idx_report_images_report_id ON report_images (report_id);
