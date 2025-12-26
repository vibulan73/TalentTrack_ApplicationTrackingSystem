# TalentTrack - Applicant Tracking System

A modern, full-stack Applicant Tracking System built with React, Spring Boot, and PostgreSQL.

## 🚀 Features

### Job Management
- Create, edit, and delete job postings
- Activate/deactivate job listings
- Public job view with application link

### Candidate Application
- Public application form for candidates
- Resume upload (PDF/DOC/DOCX)
- Automatic application tracking

### Recruiter Dashboard
- Overview of all applications and statistics
- Filter applications by job and status
- Search candidates by name or email
- Update application status (New, Shortlisted, Interviewed, Rejected, Hired)

### Authentication
- Secure JWT-based authentication
- Protected recruiter dashboard
- Role-based access control

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Create React App |
| Styling | Vanilla CSS (Dark Theme) |
| Backend | Spring Boot 4.0.0 |
| Security | Spring Security + JWT |
| Database | PostgreSQL |
| Deployment | Railway |


## 🖥️ Local Development

### Backend
```bash
cd ats-backend

# Set environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/ats_db
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=postgres
export JWT_SECRET=your-secret-key-at-least-64-characters-long-for-security
export CORS_ORIGINS=http://localhost:3000

# Run with Maven
./mvnw spring-boot:run
```

### Frontend
```bash
cd ats-frontend

# Install dependencies
npm install

# Run development server
npm start
```

### PostgreSQL (Docker)
```bash
docker run --name ats-postgres \
  -e POSTGRES_DB=ats_db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new recruiter |
| POST | /api/auth/login | Login and get JWT |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | List all active jobs (public) |
| GET | /api/jobs/my | List recruiter's jobs |
| GET | /api/jobs/:id | Get job details |
| POST | /api/jobs | Create new job |
| PUT | /api/jobs/:id | Update job |
| DELETE | /api/jobs/:id | Delete job |
| POST | /api/jobs/:id/apply | Submit application (public) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications | List all applications |
| GET | /api/applications/search | Search by name/email |
| GET | /api/applications/stats | Get dashboard stats |
| PUT | /api/applications/:id/status | Update status |

## 🔐 Default Test Credentials

After starting the application, register a new account at `/register`.

## License

MIT

## 🏗️ Design Decisions & Assumptions

### Architecture Choices
1.  **Separation of Concerns**: The project is split into `ats-backend` (Spring Boot) and `ats-frontend` (React). This creates a clean separation between data/business logic and UI, allowing for independent scaling and development.
2.  **Filesystem Storage**: For simplicity and cost-effectiveness (avoiding extra cloud buckets like S3), file uploads (resumes) are stored in the local container filesystem.
    *   *Trade-off*: In a multi-container or ephemeral environment (like free Railway tiers), files might not persist across restarts unless a persistent volume is used. This was chosen for getting started speed vs infrastructure complexity.
3.  **Stateless Authentication**: JWT (JSON Web Tokens) was chosen over session cookies to keep the backend stateless, making it easier to scale horizontally and handling CORS more predictably across different domains.

### Database Design
- **Single Role System**: To keep the initial MVP lean, the system currently assumes a "Recruiter" role effectively for all registered users. Access control is binary (Public vs Authenticated).
- **Hard Deletes**: Deleted jobs are hard-deleted from the database. A "Soft Delete" (`is_deleted` flag) was considered but omitted for simplicity in this version.
- **Relational Integrity**: `Applications` are strictly linked to `Jobs`. If a Job is deleted, the database constraint ensures data consistency (cascading delete or error, depending on business rule).

### Deployment Assumptions
- **Railway Platform**: The configuration (`railway.toml`) is optimized for Railway's "Nixpacks" builder, specifically using `npx serve` for the frontend to maximize performance vs running the heavy dev server.
- **Environment Variables**: The system acts as a "Cloud Native" app, relying entirely on environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`) rather than hardcoded configs, ensuring security and portability.

### Frontend
- **Client-Side Filtering**: For the dashboard list views, filtering and searching happens on the backend (API calls), which is more scalable than client-side filtering, though slightly more complex to implement.
- **No Redux**: `React Context API` was used for Auth state instead of Redux. Redux would be overkill for the current state complexity (User + Theme).
