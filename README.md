# SchoolSafety Backend

Spring Boot backend for the SchoolSafety application. This repository currently provides the backend API, MySQL persistence, and HTTP Basic authentication with `ADMIN` and `USER` roles.

## Requirements

- Java 21
- MySQL 8+
- Maven Wrapper (`mvnw.cmd` is included)

## Local setup

1. Create a MySQL database named `school_safety`.
2. Set database credentials in your shell before starting the app.

PowerShell:

```powershell
$env:DB_USERNAME="your_mysql_user"
$env:DB_PASSWORD="your_mysql_password"
.\mvnw.cmd spring-boot:run
```

The app connects to:

```text
jdbc:mysql://localhost:3306/school_safety
```

## Seeded local login

On startup, the app seeds a default admin account for local development if it does not already exist.

- Email: `admin@schoolsafety.local`
- Password: `Admin123!`
- Role: `ADMIN`

## Authentication

- Auth type: HTTP Basic
- Username: user email
- Password: plaintext password matched against the BCrypt hash stored in `users.password_hash`

Use `/api/auth/me` to verify the authenticated user from the frontend.

## Role access

- `ADMIN`: full access to management endpoints
- `USER`: authenticated access to report and metadata endpoints

Current URL rules:

- Admin only: `/api/users/**`, `/api/schools/**`, `/api/roles/**`
- Authenticated `USER` or `ADMIN`: `/api/reports/**`, `/api/reports/*/images/**`, `/api/report-metadata/**`, `/api/auth/me`

## Database initialization

- `schema.sql` creates the schema
- `data.sql` seeds roles, report metadata, and the local admin user
- startup is configured to continue if schema objects already exist, which makes repeated local restarts easier

