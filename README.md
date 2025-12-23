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

## 📁 Project Structure

```
├── ats-backend/          # Spring Boot Backend
│   ├── src/main/java/com/ats/
│   │   ├── config/       # Security & CORS config
│   │   ├── controller/   # REST endpoints
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── model/        # JPA Entities
│   │   ├── repository/   # Data repositories
│   │   ├── security/     # JWT utilities
│   │   └── service/      # Business logic
│   └── Dockerfile
│
└── ats-frontend/         # React Frontend
    └── src/
        ├── api/          # Axios configuration
        ├── components/   # Reusable components
        ├── context/      # Auth context
        └── pages/        # Application pages
```

## 🚀 Deployment to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with the code

### Step 1: Create Railway Project
1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub repository

### Step 2: Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Copy the `DATABASE_URL` from the Variables tab

### Step 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Select your repo and set Root Directory to `ats-backend`
3. Add these environment variables:
   ```
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<generate-a-secure-64-char-secret>
   CORS_ORIGINS=https://your-frontend-url.railway.app
   UPLOAD_DIR=/app/uploads
   ```
4. Railway will automatically build and deploy

### Step 4: Deploy Frontend
1. Click "New" → "GitHub Repo"
2. Select your repo and set Root Directory to `ats-frontend`
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
4. Railway will automatically build and deploy

### Step 5: Update CORS
After both are deployed, update the backend's `CORS_ORIGINS` with the actual frontend URL.

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

## 📸 Screenshots

The application features a modern dark theme with:
- Gradient accents
- Glassmorphism effects
- Responsive design
- Status badges with colors

## License

MIT
