# SchoolSafety App

A web application for reporting unsafe situations near schools. Students and community members can submit reports about traffic hazards, unsafe crosswalks, missing signage, poor lighting, and other safety concerns near Skopje secondary schools.

## Tech Stack

**Backend:** Java 21 · Spring Boot · Spring Security (HTTP Basic) · Spring Data JPA · MySQL  
**Frontend:** React 18 · Vite · Tailwind CSS · React Router v6 · Axios

## Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8+

## Setup

### 1. Database

Create the database:

```sql
CREATE DATABASE school_safety;
```

### 2. Run the backend

Credentials are read from environment variables:

```powershell
# PowerShell
$env:DB_PASSWORD="your_mysql_password"; .\mvnw spring-boot:run
```

```bash
# bash / Git Bash
DB_PASSWORD=your_mysql_password ./mvnw spring-boot:run
```

`DB_USERNAME` defaults to `root`. Override it the same way if needed.

On first startup, Hibernate auto-creates the schema and `data.sql` seeds default roles, report types, statuses, and all 23 Skopje secondary schools.

The API is available at `http://localhost:8081`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app is available at `http://localhost:5174`. The Vite dev server proxies all `/api` requests to the backend automatically.

## Default accounts

Seed data creates one admin account for local development:

| Email | Password | Role |
|---|---|---|
| `admin@schoolsafety.local` | `Admin123!` | ADMIN |

New accounts registered via the signup page receive the `USER` role and can later link themselves to a school from their profile.

## Features

- **Public:** homepage, register account, view schools
- **User:** submit safety reports, apply as student (link account to a school), view reports
- **Admin:** manage users, schools, and reports; update report statuses

## Run the ML Service

The ML service is used for:

- **automatic** report classification
- **suggested** report priority
- **risky keyword** detection

Open a terminal in the project root and run:
```bash
cd ml-service
python -m venv venv
```

Activate the virtual environment.

PowerShell:

```bash
.\venv\Scripts\activate
```

bash / Git Bash:

```bash
source venv/bin/activate
```
Install dependencies:

```bash
pip install -r requirements.txt
```

Prepare the training dataset:

```bash
python prepare_dataset.py
```

Train the ML model:

```bash
python train_model.py
```

Start the ML service:

```bash
uvicorn main:app --reload --port 8001
```

The ML service is available at:

http://localhost:8001

Health check:

http://localhost:8001/health

FastAPI documentation:

http://localhost:8001/docs

The Spring Boot backend calls this service when a new report is created or updated.

## Project structure

```
SchoolSafety/
├── src/main/java/org/example/schoolsafety/
│   ├── auth/          # Registration, login, apply-student endpoints
│   ├── common/        # Shared exceptions, API error responses, base entities
│   ├── config/        # Spring Security and app configuration
│   ├── report/        # Report entity, service, controller, AI integration
│   │   ├── ai/        # Java DTOs and service for calling the ML service
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── service/
│   ├── role/          # Role entity, repository, service, controller
│   ├── school/        # School entity, service, controller
│   └── user/          # User entity, service, controller
├── src/main/resources/
│   ├── application.properties   # Backend configuration
│   ├── schema.sql               # Optional database schema
│   └── data.sql                 # Seed data
├── ml-service/                  # Python FastAPI ML service
│   ├── data/
│   │   ├── nyc_311_sample.csv
│   │   ├── reports_training_data.csv
│   │   └── custom_school_safety_examples.csv
│   ├── model/
│   │   └── report_classifier.joblib
│   ├── main.py                  # FastAPI service
│   ├── prepare_dataset.py       # Dataset preprocessing
│   ├── train_model.py           # Model training script
│   └── requirements.txt         # Python dependencies
└── frontend/                    # React + Vite frontend
    └── src/
        ├── api/                 # Axios API clients
        ├── components/          # Navbar, Footer, ProtectedRoute
        ├── context/             # AuthContext
        └── pages/               # Login, signup, reports, admin, map, statistics pages
```
