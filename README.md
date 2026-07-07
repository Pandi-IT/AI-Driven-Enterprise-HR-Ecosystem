# 🚀 AI-Driven Enterprise HR Ecosystem (Employee Management System)

A state-of-the-art, production-ready, full-stack **Enterprise HR & Recruitment Ecosystem**. This platform integrates modern HR directory management, attendance tracking, leave requests, and employee engagement pulse surveys with a powerful **Llama 3.3-powered AI engine** for advanced HR analytics, recruitment evaluation, and administrative assistance.

Built with a high-performance **Angular 21** frontend, a robust **Spring Boot 3.5** backend, a **MySQL 8.0** database, and dockerized for instant local or cloud deployment.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:**
  - **Framework:** Angular 21 (Vite & ESBuild application builder)
  - **Styling:** Vanilla CSS (Modern, premium dark-themed dashboard, responsive design)
  - **HTTP Client:** Angular HttpClient with dynamic build-time environments
- **Backend:**
  - **Framework:** Spring Boot 3.5.5 (Java 21)
  - **ORM:** Spring Data JPA (Hibernate)
  - **Security/Properties:** Dynamic Environment Injection & `spring-dotenv` integration
- **AI Engine:**
  - **Framework:** Spring AI (OpenAI Proxy Integration)
  - **LLM Provider:** Groq API (`llama-3.3-70b-versatile`)
- **Database:**
  - **RDBMS:** MySQL 8.0 (Dockerized & local configurations)
- **Containerization & Routing:**
  - **Orchestration:** Docker Compose
  - **Web Server & Reverse Proxy:** NGINX (Static file hosting + dynamic API reverse-proxying)

---

## ✨ System Features

### 1. Core HR Modules
* **Employee Directory:** Full CRUD operations (Add, View, Update, Terminate) for managing employee profiles, departments, salaries, and contact details.
* **Attendance Tracker:** Check-in and check-out logs tracking daily attendance, timestamps, and status.
* **Leave Management Portal:** Request leave requests, review employee leave balances, and approve/reject requests with automatic HR workflows.
* **Pulse Surveys:** Employee voice tool capturing numeric satisfaction ratings (1-5) and comments for real-time engagement sentiment tracking.

### 2. Recruitment & Careers Portal
* **Job Board:** Create and publish job openings with target departments.
* **Applicant Tracking System (ATS):** Allow candidates to submit applications and resumes to specific jobs.

### 3. AI-Powered Cognitive HR Engine
* **Cognitive Assistant (HR Chat):** Generates responses to general HR queries.
* **HR Email Generator:** Auto-generates structured, warm, and authoritative HR letters/emails based on custom scenarios.
* **Performance Evaluator:** Analyzes employee profiles, attendance logs, and past reviews to score performance, identify top strengths, outline improvements, and recommend actions (e.g., promotion/development plan).
* **Leave Response Assistant:** Drafts customized letters approving or rejecting leave requests based on historical leave patterns.
* **Attendance Pattern Analyzer:** Identifies lateness/absenteeism trends and outputs a critical Risk Level (Low/Medium/High) along with corrective action items.
* **Recruitment JD Generator:** Writes customized Job Descriptions (Role, Responsibilities, Required Skills) for new roles instantly.
* **Candidate Suitability Ranker:** Performs semantic matching between a job description and a candidate's resume, producing a suitability score (0-100), key skills gap breakdown, and recruitment verdict.
* **Attrition Risk Analytics:** Analyzes attendance, leaves, and reviews to predict turnover risks and suggest retention strategies.
* **Morale Sentiment Summarizer:** Processes pulse survey scores and text feedback to compile engagement summaries and actionable HR recommendations.

---

## 📂 Project Directory Structure

```text
Employee-Management-System/
├── Employee mangement/
│   ├── docker-compose.yml       # Production Docker orchestration config
│   │
│   ├── employee/                # Spring Boot Backend (Java 21)
│   │   ├── src/                 # Main Java source files and properties
│   │   ├── pom.xml              # Maven dependencies (Spring Boot, Spring AI, spring-dotenv)
│   │   ├── Dockerfile           # Multi-stage JRE Alpine container build
│   │   ├── .env.example         # Backend environment variables template
│   │   └── .gitignore           # Ignores build outputs (target/) and local secrets
│   │
│   └── frontend/                # Angular 21 Frontend
│       ├── src/                 # Components, routes, styles, assets
│       ├── nginx.conf           # Production NGINX web server & proxy rules
│       ├── set-env.js           # Build-time environment injector script
│       ├── angular.json         # Build and replacement configurations
│       ├── package.json         # NPM scripts and dependencies
│       ├── Dockerfile           # Multi-stage build hosting static files in NGINX
│       ├── .env.example         # Frontend environment variables template
│       └── .gitignore           # Ignores generated environment folders and local secrets
└── README.md                    # System documentation
```

---

## ⚙️ Environment Variables Separation

The platform utilizes separate `.env` configurations to separate variables and secrets from code, making the application cloud-ready and deployable without modifications.

### Backend Configurations (`employee/.env`)
Create a `.env` file in the `Employee mangement/employee/` directory.

| Variable | Description | Default Local Value |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | JDBC URL for MySQL Database connection | `jdbc:mysql://localhost:3306/employee_db` |
| `SPRING_DATASOURCE_USERNAME` | MySQL database connection username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | MySQL database connection password | `your_mysql_password` |
| `MYSQL_ROOT_PASSWORD` | Database root password (used by Docker Compose DB) | `your_mysql_password` |
| `MYSQL_DATABASE` | Initial database name to create | `employee_db` |
| `SERVER_PORT` | Port where the Spring Boot application listens | `8080` |
| `GROQ_API_KEY` | Your Groq API key for Llama AI integration | `YOUR_API_KEY` |
| `GROQ_BASE_URL` | Base URL for API requests | `https://api.groq.com/openai` |
| `GROQ_MODEL` | The LLM Model used for processing HR requests | `llama-3.3-70b-versatile` |

### Frontend Configurations (`frontend/.env`)
Create a `.env` file in the `Employee mangement/frontend/` directory.

| Variable | Description | Default Local Value |
| :--- | :--- | :--- |
| `API_URL` | Local dev endpoint for API requests | `http://localhost:8081/api` |
| `PRODUCTION` | Target environment compile flag | `false` |

---

## 🚀 Setup & Launch Instructions

### Method 1: Instant Launch via Docker Compose (Recommended)
This approach launches the entire stack (Database, Backend API, Frontend, and NGINX Proxy) automatically inside isolated container environments.

1. Navigate to the root deployment directory:
   ```bash
   cd "Employee mangement"
   ```
2. Setup your Backend environment file:
   - Copy `employee/.env.example` to `employee/.env`
   - Fill in your `GROQ_API_KEY` inside `employee/.env`.
3. Launch the container cluster:
   ```bash
   docker compose up --build -d
   ```
4. Access the applications:
   - **Frontend Dashboard:** [http://localhost](http://localhost) (Served on standard Port `80` with NGINX reverse-proxying API calls automatically to avoid CORS)
   - **Backend Service:** [http://localhost:8081/api/health](http://localhost:8081/api/health)
   - **MySQL Database:** Exists locally on port `3307` (mapped internally to `3306`)

---

### Method 2: Manual Local Development Launch

#### 1. Database Setup
Ensure you have MySQL installed locally and running.
Create the database:
```sql
CREATE DATABASE employee_db;
```

#### 2. Backend API Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd "Employee mangement/employee"
   ```
2. Configure `.env`:
   - Copy `.env.example` to `.env`.
   - Update database passwords and supply a valid `GROQ_API_KEY`.
3. Start the application using Maven Wrapper:
   - **Windows:**
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **macOS/Linux:**
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
4. Confirm health check: [http://localhost:8080/api/health](http://localhost:8080/api/health)

#### 3. Frontend Dashboard Setup (Angular)
1. Navigate to the frontend directory:
   ```bash
   cd "Employee mangement/frontend"
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   - Copy `.env.example` to `.env`.
4. Launch the Angular development server:
   ```bash
   npm run start
   ```
   *Note: This command runs `node set-env.js` automatically which compiles environment variables into `src/environments/environment.ts` before serving Angular.*
5. Access the app in your browser: [http://localhost:4200](http://localhost:4200)

---

## 🔗 Key API Endpoints

### 1. Employee Directory
* `GET /api/employees` - Retrieve all employees.
* `GET /api/employees/{id}` - Retrieve detailed info of a single employee.
* `POST /api/employees` - Create a new employee profile.
* `PUT /api/employees/{id}` - Update details of an existing employee.
* `DELETE /api/employees/{id}` - Terminate/delete an employee.

### 2. Attendance & Leave logs
* `GET /api/attendance` - Fetch general attendance logs.
* `POST /api/attendance` - Log a check-in / check-out.
* `GET /api/leaves` - List leave requests.
* `POST /api/leaves` - Request a leave application.
* `PUT /api/leaves/{id}/status` - Approve/Reject a leave request.

### 3. Cognitive HR & AI Assistance
* `POST /api/ai/chat` - Interact with the general HR assistant chatbot.
* `POST /api/ai/email/generate` - Generate HR emails (Requires payload parameters).
* `POST /api/ai/evaluate` - Generate a performance evaluation.
* `POST /api/ai/attendance/analyze` - Analyze attendance habits and risk patterns.
* `POST /api/ai/leave/respond` - Draft leave responses.
* `POST /api/ai/recruitment/generate-jd` - Generate role specifications.
* `POST /api/ai/recruitment/rank-candidate` - Rank candidate resume against JD.
* `POST /api/ai/analytics/attrition-risk` - Calculate employee retention risk.
* `POST /api/ai/analytics/mood-summary` - Analyze morale trend based on pulse surveys.
