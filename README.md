# 🚀 AuraHR: AI-Driven Enterprise HR & Cognitive Recruitment Ecosystem

AuraHR is a state-of-the-art, production-ready, full-stack **Enterprise HR Directory & Recruitment Ecosystem**. This platform integrates modern employee directory management, attendance tracking, leave requests, and employee engagement surveys with a powerful **Llama 3.3-powered AI engine** for advanced HR analytics, recruitment evaluation, and administrative automation.

Built with a high-performance **React (Vite, TypeScript, Tailwind CSS v4)** frontend, a robust **Spring Boot 3.5 (Java 21)** backend, a **PostgreSQL/MySQL** database, and dockerized for instant local or cloud deployment.

---

## 🗺️ Architectural Design

Below is the production deployment architecture showing the separation of concerns between client-side hosting, backend computing, and database management.

```mermaid
graph TD
    subgraph Client Space (Netlify / Static Hosting)
        A[React Frontend] -->|Browser Requests| B(Client Router)
        A -->|API Calls / HTTPS| C{CORS Gateway}
    end

    subgraph Server Space (Render / Docker Web Service)
        C -->|Valid Origin & JWT| D[Spring Boot Backend]
        D -->|Security Filter| E[JWT Authentication]
        D -->|Cognitive Tasks| F[Spring AI Client]
    end

    subgraph AI Space (Groq Cloud API)
        F -->|API Key Auth| G[Llama 3.3 70B Model]
    end

    subgraph Database Space (Render Managed Postgres / MySQL)
        D -->|Hikari Connection Pool| H[(Relational Database)]
    end
```

---

## 📂 Project Directory Structure

```text
Employee-Management-System/
├── Employee mangement/
│   ├── docker-compose.yml       # Docker Compose orchestration config (Staging)
│   │
│   ├── employee/                # Spring Boot Backend (Java 21)
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/example/employee/
│   │   │   │   │   ├── config/          # CORS, Security, Data Bootstrapping
│   │   │   │   │   ├── controller/      # API Controllers (REST Endpoints)
│   │   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── exception/       # Global Exception Handling
│   │   │   │   │   ├── model/           # Entity Models (JPA mappings)
│   │   │   │   │   ├── repository/      # Database Repositories
│   │   │   │   │   ├── security/        # JWT Filters, Providers, Roles
│   │   │   │   │   └── service/         # Business Logic (AI, HR Modules)
│   │   │   │   └── resources/
│   │   │   │       ├── application.properties      # Base configurations
│   │   │   │       ├── application-dev.properties  # Local dev profile
│   │   │   │       └── application-prod.properties # Production profile (HikariCP)
│   │   ├── pom.xml              # Maven dependencies
│   │   └── Dockerfile           # Multi-stage JRE Alpine container build
│   │
│   └── frontend/                # React Frontend (Vite + TypeScript)
│       ├── public/
│       │   └── _redirects        # Netlify client-side routing redirect rules
│       ├── src/
│       │   ├── components/      # Common UI elements
│       │   ├── layouts/         # Page shell structures
│       │   ├── pages/           # Views (Dashboard, Employees, AI Assistant)
│       │   ├── services/        # Axios API Client with JWT interceptors
│       │   └── main.tsx         # App entrypoint
│       ├── package.json         # NPM scripts and dependencies
│       ├── vite.config.ts       # Vite config (loaded with backend port resolvers)
│       └── Dockerfile           # Multi-stage build hosting static files in NGINX
└── README.md                    # System documentation
```

---

## ⚙️ Environment Variables Separation

### Backend Configurations (`employee/.env`)
Create a `.env` file in the `employee/` directory for local development:

| Variable | Description | Default Local Value |
| :--- | :--- | :--- |
| `DB_HOST` | Database server hostname | `localhost` |
| `DB_PORT` | Database port number | `3306` |
| `DB_NAME` | Relational database schema name | `employee_db` |
| `SPRING_DATASOURCE_USERNAME`| Database connection username | `root` |
| `SPRING_DATASOURCE_PASSWORD`| Database connection password | `your_password` |
| `MYSQL_ROOT_PASSWORD` | Database root password (Docker Compose only) | `your_password` |
| `MYSQL_DATABASE` | Database to bootstrap (Docker Compose only) | `employee_db` |
| `SERVER_PORT` | Port where the Spring Boot application listens | `8080` |
| `SPRING_PROFILES_ACTIVE` | Active configuration profile (`dev` or `prod`) | `dev` |
| `APP_JWT_SECRET` | Secret key for generating JWT signatures | `default-secret-key-very-long`|
| `APP_CORS_ALLOWED_ORIGINS` | Permitted cross-origin hosts | `*` |
| `GROQ_API_KEY` | API token for Groq Cloud integration | `YOUR_API_KEY` |
| `GROQ_BASE_URL` | API base URL for OpenAI-compatible client | `https://api.groq.com/openai` |
| `GROQ_MODEL` | The LLM model used for cognitive HR tasks | `llama-3.3-70b-versatile` |

### Frontend Configurations (`frontend/.env`)
Create a `.env` file in the `frontend/` directory for local development:

| Variable | Description | Default Local Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Local API gateway endpoint | `http://localhost:8080/api` |

---

## 🚀 Setup & Launch Instructions (Local Development)

### Prerequisites
* **Java Development Kit (JDK) 21**
* **Node.js** (v18 or higher) and **npm**
* **MySQL 8.0** (running locally)

### Step 1: Database Setup
Login to your local MySQL server and create the database schema:
```sql
CREATE DATABASE employee_db;
```

### Step 2: Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd "Employee mangement/employee"
   ```
2. Copy `.env.example` to `.env` and fill in your database credentials and `GROQ_API_KEY`.
3. Start the application:
   - **Windows (PowerShell):**
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **Linux / macOS:**
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
4. Verification: Visit [http://localhost:8080/api/health](http://localhost:8080/api/health) to confirm the service is running.

### Step 3: Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd "Employee mangement/frontend"
   ```
2. Copy `.env.example` to `.env` and adjust the API URL if needed.
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
4. Access the web interface: Open [http://localhost:5173](http://localhost:5173).

---

## 🐳 Instant Launch via Docker Compose (Staging)

This launches the entire stack (Database, Backend API, Frontend, and NGINX Proxy) automatically inside isolated container environments.

1. Navigate to the deployment root:
   ```bash
   cd "Employee mangement"
   ```
2. Run the cluster:
   ```bash
   docker compose up --build -d
   ```
3. Access the applications:
   - **Frontend App**: [http://localhost](http://localhost) (Served via NGINX reverse-proxying API requests automatically to avoid CORS)
   - **Backend API Health Check**: [http://localhost:8081/api/health](http://localhost:8081/api/health)

---

## ☁️ Cloud Deployment Guide (Production)

### 1. Database Provisioning (Render PostgreSQL)
1. Log in to the **Render Dashboard** and click **New > PostgreSQL**.
2. Define a database name, region, and select the free tier.
3. Click **Create Database**.
4. Once active, note the **Internal Database URL** (for backend services in the same Render region) and connection details (Host, Username, Password, Database Name).

### 2. Backend Deployment (Render Web Service)
1. Click **New > Web Service** and link your Git repository.
2. Configure settings:
   - **Root Directory**: `Employee mangement/employee`
   - **Runtime**: `Docker` (Render automatically detects the multi-stage `Dockerfile`)
3. Under the **Environment** tab, click **Add Environment Variable** and configure the following:
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<render-internal-host>:5432/<dbname>`
   - `SPRING_DATASOURCE_USERNAME` = `<render-postgres-username>`
   - `SPRING_DATASOURCE_PASSWORD` = `<render-postgres-password>`
   - `GROQ_API_KEY` = `<your-groq-api-key>`
   - `GROQ_BASE_URL` = `https://api.groq.com/openai`
   - `GROQ_MODEL` = `llama-3.3-70b-versatile`
   - `APP_JWT_SECRET` = `<your-secure-random-32-char-string>`
   - `APP_CORS_ALLOWED_ORIGINS` = `https://your-frontend.netlify.app` *(Replace with your Netlify frontend URL)*
4. Click **Deploy Web Service**.

### 3. Frontend Deployment (Netlify)
1. Log in to **Netlify** and select **Add new site > Import an existing project**.
2. Select your repository and configure the build settings:
   - **Base directory**: `Employee mangement/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Go to **Site settings > Environment variables** and add:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api` *(Your Render backend domain followed by /api)*
4. Go to **Deploys > Trigger Deploy > Clear cache and deploy site** to build.

---

## 🔒 Security Architecture

### 1. Stateless Authentication (JWT)
AuraHR employs stateless authentication using JSON Web Tokens (JWT).
* When a user logs in, the server generates an **Access Token** (expires in 15 minutes) and a **Refresh Token** (expires in 7 days).
* The React frontend automatically intercepts outgoing HTTP requests via Axios interceptors ([api.ts](file:///d:/Full%20stack%20projects/Employee-Management-System/Employee%20mangement/frontend/src/services/api.ts#L12)) to inject the Bearer token.
* If a request fails with a `401 Unauthorized` status, the response interceptor attempts to refresh the access token silently using the refresh token, providing a seamless user experience.

### 2. CORS Policy
CORS is configured dynamically via [CorsConfig.java](file:///d:/Full%20stack%20projects/Employee-Management-System/Employee%20mangement/employee/src/main/java/com/example/employee/config/CorsConfig.java).
* In development, it defaults to allowing any host (`*`) utilizing `allowedOriginPatterns` to safely exchange authentication headers.
* In production, the backend restricts access to origin URLs defined in the `APP_CORS_ALLOWED_ORIGINS` environment variable. Multiple allowed hosts can be defined using commas (e.g., `https://domain1.com,https://domain2.com`).

---

## 🧠 AI Cognitive HR Engine Deep Dive

AuraHR integrates a Cognitive AI engine powered by Spring AI and the Groq Cloud API. Key modules include:

### 1. Performance Evaluator (`POST /api/ai/evaluate`)
Processes employee profiles, attendance logs, and past reviews to score performance, outline strengths, identify gaps, and suggest promotion or development plans.

### 2. Attrition Risk Analyzer (`POST /api/ai/analytics/attrition-risk`)
Analyzes attendance stability, leave request frequency, satisfaction trends, and performance ratings to output a turn-over risk evaluation (Low/Medium/High) along with retention strategies.

### 3. Candidate Suitability Ranker (`POST /api/ai/recruitment/rank-candidate`)
Performs semantic text analysis comparing an uploaded resume with a target Job Description. Returns a match score (0-100), key skills gap breakdown, and a hiring verdict.

### 4. Attendance Trend Analyzer (`POST /api/ai/attendance/analyze`)
Processes daily timestamp check-in logs to identify chronic lateness or absenteeism patterns, generating risk levels and structured corrective action recommendations.

---

## 🔗 REST API Endpoint Reference

### 1. Authentication
* `POST /api/auth/login`
  - *Payload*: `{"email": "admin@co.com", "password": "admin123"}`
  - *Response*: `{"accessToken": "...", "refreshToken": "...", "email": "admin@co.com", "role": "ROLE_ADMIN"}`
* `POST /api/auth/refresh`
  - *Payload*: `{"refreshToken": "..."}`
  - *Response*: `{"accessToken": "...", "refreshToken": "..."}`

### 2. Employee Directory
* `GET /api/employees` - Retrieve all employee profiles.
* `GET /api/employees/{id}` - Retrieve details of a single employee.
* `POST /api/employees` - Create a new employee.
* `PUT /api/employees/{id}` - Update employee data.
* `DELETE /api/employees/{id}` - Remove an employee.

### 3. Attendance & Leaves
* `GET /api/attendance` - Fetch general attendance logs.
* `POST /api/attendance` - Log a check-in / check-out.
* `GET /api/leaves` - List leave requests.
* `POST /api/leaves` - Request a leave application.
* `PUT /api/leaves/{id}/status` - Approve/Reject a leave request.

### 4. Cognitive HR & AI Assistance
* `POST /api/ai/chat` - Interact with the general HR assistant chatbot.
* `POST /api/ai/evaluate` - Generate a performance evaluation.
* `POST /api/ai/analytics/attrition-risk` - Calculate employee retention risk.
* `POST /api/ai/recruitment/rank-candidate` - Rank candidate resume against JD.

---

## 🛠️ Troubleshooting & Common Issues

### 1. Netlify 404 Page Not Found (On Page Refresh)
* **Cause**: Client-side routing (React Router) intercepts links. When refreshing or loading a subpath directly, the static server looks for a folder named `/login` and fails.
* **Solution**: The `_redirects` file must be present in your build output. Ensure `frontend/public/_redirects` is committed to git. Netlify will copy this file to the `dist` folder automatically, redirecting routing fallback to `index.html`.

### 2. CORS Blocked error
* **Cause**: Deployed frontend URL is not configured on the backend, or the backend is configured with a trailing slash in the `APP_CORS_ALLOWED_ORIGINS` variable.
* **Solution**: Verify the value of `APP_CORS_ALLOWED_ORIGINS` on Render. It should match your frontend Netlify address without a trailing slash (e.g. `https://example.netlify.app`).

### 3. Database Schema Validation Failures
* **Cause**: In production profile, `spring.jpa.hibernate.ddl-auto` defaults to `validate`. If the database tables have not been created, the server will crash on startup.
* **Solution**: When launching the backend container for the first time, you can temporarily override the variable `SPRING_JPA_HIBERNATE_DDL_AUTO=update` to let Spring Boot auto-generate the schemas, then set it back to `validate` for security.
