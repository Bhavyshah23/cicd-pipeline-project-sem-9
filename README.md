☁️ CloudCart — E-Commerce Platform with CI/CD Pipeline & Agentic AI Assistant
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Java](https://img.shields.io/badge/Java-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AI](https://img.shields.io/badge/Agentic%20AI-Chat%20Assistant-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow?style=for-the-badge)

> **M.Sc. IT — Cloud & Application Development | 4-Credit Capstone Project**
> An e-commerce platform (CloudCart) with an automated CI/CD pipeline and an agentic AI assistant that lets admins query stock, orders, users, and delivery status in plain English — plus proactive alerts for issues that need attention.

---

## 📌 Table of Contents
- [About the Project](#-about-the-project)
- [Current Project Status](#-current-project-status)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Modules](#-project-modules)
- [AI Assistant — Capstone Extension](#-ai-assistant--capstone-extension)
- [CI/CD Pipeline Flow (Planned)](#-cicd-pipeline-flow-planned)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Team Members](#-team-members)
- [Project Timeline](#-project-timeline)
- [Future Enhancements](#-future-enhancements)

---

## 📖 About the Project

CloudCart is a full-stack e-commerce admin platform built with Spring Boot and React. This capstone project extends it with two things: an automated CI/CD pipeline (build, test, containerize, deploy), and an **agentic AI assistant** that lets admins ask natural-language questions about stock, orders, users, and deliveries instead of manually navigating screens and filters.

**What it does (once complete):**
1. A developer pushes code to GitHub
2. GitHub Actions automatically builds, tests, and containerizes the app
3. The container is deployed (target hosting TBD — see [Future Enhancements](#-future-enhancements))
4. An admin opens a chat panel in the CloudCart dashboard and asks questions like *"Which products are low on stock?"* or *"Show me undelivered orders from this week"*
5. The AI assistant reasons over the request, safely queries the existing backend, and responds in plain English — and can proactively flag issues (e.g. low stock) without being asked

**Why it matters:** This demonstrates both solid DevOps fundamentals (CI/CD automation) and practical Generative AI / Agentic AI skills applied to a real operational problem, not just a toy chatbot demo.

---

## ✅ Current Project Status

To keep this accurate and up to date:

| Component | Status |
|---|---|
| Spring Boot backend (Product, Order, Category, User models, JWT auth) | ✅ Done |
| React frontend (protected routes, admin dashboard) | ✅ Done |
| CI/CD pipeline (GitHub Actions) | 🔲 Not started |
| Dockerization | 🔲 Not started |
| Cloud deployment | 🔲 Not started |
| AI Assistant — Query Understanding & Data Retrieval Agents | 🔲 Not started |
| AI Assistant — Proactive Alerts Agent | 🔲 Not started |

> Infrastructure-as-Code (Terraform) is intentionally out of scope for this project — see [Future Enhancements](#-future-enhancements).

---

## 🏗️ Architecture

```
Developer (Code Push)
        │
        ▼
   GitHub Repository
        │
        ▼
  GitHub Actions CI/CD Pipeline
  ┌─────────────────────────────────────────┐
  │  Build → Test → Code Quality → Docker  │
  │              Build → Deploy            │
  └─────────────────────────────────────────┘
        │
        ▼
   CloudCart Application
  ┌──────────────────────────────────────────────┐
  │   React Frontend (Admin Dashboard + Chat UI)  │
  │                   │                           │
  │        Spring Boot Backend (REST API)         │
  │                   │                           │
  │              MySQL Database                   │
  │                   │                           │
  │         AI Assistant Service (Agentic)        │
  │   Query Understanding → Data Retrieval →       │
  │        Response Generation → Proactive Alerts │
  └──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Backend | Java 17, Spring Boot, Maven | REST API application |
| Database | MySQL | Application data (products, orders, users) |
| Frontend | React, React Router v6 | Admin dashboard + chat interface |
| Containerization | Docker | Package the application |
| CI/CD | GitHub Actions | Build, test, and deployment automation |
| AI / Agentic Layer | LLM API (Claude/GPT), Python or Spring Boot service | Natural language query understanding, response generation, proactive insights |
| Version Control | Git, GitHub | Source code management |

---

## 📦 Project Modules

**Module 1 — Spring Boot REST API** *(Jeel Prajapati)*
- CRUD REST API built with Spring Boot
- Connected to MySQL database
- JWT-based authentication
- Endpoints: `GET /products`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`, plus Order and User endpoints

**Module 2 — React Frontend** *(Jeel Prajapati)*
- Admin dashboard with protected routes
- JWT-based auth flow
- Product, order, and user management screens

**Module 3 — CI/CD Pipeline** *(Bhavy Shah)*
- GitHub Actions workflow: Build → Test → Code Quality → Docker Build → Deploy
- Triggers on every push to `main` branch
- Pipeline status visible on GitHub Actions tab

**Module 4 — Agentic AI Assistant (Capstone Extension)** *(Bhavy Shah & Jeel Prajapati)*
- See [AI Assistant — Capstone Extension](#-ai-assistant--capstone-extension) below

---

## 🤖 AI Assistant — Capstone Extension

**Title:** *CloudCart AI Assistant — Agentic AI-Powered Conversational System for Inventory, Order, and Delivery Management*

### Problem Statement
Admins currently must manually navigate multiple screens and filters to answer operational questions — stock levels, order status, delivery delays. There's no way to simply ask and get an answer, and no way to be proactively warned about issues before they become a problem.

### Agent Architecture

| Agent | Role |
|---|---|
| **Query Understanding Agent** | Parses the admin's natural language question and identifies intent (stock check, order lookup, delivery status, etc.) |
| **Data Retrieval Agent** | Converts intent into a safe, parameterized request against the existing Spring Boot API — never raw/arbitrary SQL from the LLM |
| **Response Agent** | Formats retrieved data into a clear, human-readable answer |
| **Proactive Alert Agent** | Periodically scans for low-stock products or delayed deliveries and surfaces them without being asked — this is what makes the system "agentic" rather than a simple Q&A chatbot |

### Example Interactions
- *"How many units of Wireless Mouse are left in stock?"*
- *"Show me all undelivered orders from the last 7 days"*
- *"Which products need restocking soon?"*
- *(Proactively, without being asked)* "⚠️ Product 'USB-C Cable' has dropped below 10 units — consider restocking."

### Why This Approach
- Reuses the existing Product/Order/User database — no new data model needed
- Genuinely agentic (multi-step reasoning + proactive behavior), not just a single prompt wrapped in a chat UI
- Directly matches the feature requested by faculty
- Fully buildable and demoable without any cloud deployment — runs on the existing frontend + backend

---

## 🔄 CI/CD Pipeline Flow (Planned)

```yaml
Trigger: Push to main branch
    │
    ├── Stage 1: Build
    │       └── mvn clean package
    │
    ├── Stage 2: Test
    │       └── mvn test (JUnit)
    │
    ├── Stage 3: Code Quality
    │       └── SonarQube scan (optional)
    │
    ├── Stage 4: Docker Build
    │       └── docker build -t cloudcart-app .
    │
    └── Stage 5: Deploy
            └── Deploy container (target hosting TBD)
```

---

## 🚀 Getting Started

### Prerequisites
```
Java 17+
Maven 3.8+
Node.js 18+
Docker Desktop
Git
```

### Clone the Repository
```bash
git clone https://github.com/Bhavyshah23/cicd-pipeline-project-sem-9.git
cd cicd-pipeline-project-sem-9
```

### Run the Spring Boot Backend Locally
```bash
cd cicd-pipeline
mvn clean install
mvn spring-boot:run
```
API available at: `http://localhost:8080`

### Run the React Frontend Locally
```bash
cd frontend
npm install
npm start
```
Frontend available at: `http://localhost:3000`

### Run with Docker (once Dockerized)
```bash
docker build -t cloudcart-app .
docker run -p 8080:8080 cloudcart-app
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory (never commit this to GitHub):

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cloudcart
DB_USERNAME=root
DB_PASSWORD=your_password

# AI Assistant
LLM_API_KEY=your_llm_api_key
```

> ⚠️ **Important:** Add `.env` to your `.gitignore` — never push credentials or API keys to GitHub.

---

## 👥 Team Members

| Name | Role | Responsibilities |
|---|---|---|
| Bhavy Shah | DevOps & AI Assistant Lead | CI/CD pipeline, Docker, AI Assistant architecture (agents, LLM integration) |
| Jeel Prajapati | Backend & Frontend Developer | Spring Boot API, React frontend, database, monitoring |

**Institution:** [Your Institution Name]
**Program:** M.Sc. Information Technology — Cloud & Application Development
**Academic Year:** 2025–2026

---

## 📅 Project Timeline

| Week | Milestone | Status |
|---|---|---|
| 1 | GitHub setup + Spring Boot project + React frontend created | ✅ Done |
| 2 | Backend/frontend integration, auth flow working | ✅ Done |
| 3 | GitHub Actions pipeline: build + test stages | 🔄 In Progress |
| 4 | Dockerize the application | ⏳ Upcoming |
| 5 | Complete CI/CD pipeline (build → test → docker → deploy) | ⏳ Upcoming |
| 6 | AI Assistant: Query Understanding + Data Retrieval agents | ⏳ Upcoming |
| 7 | AI Assistant: Response generation + chat UI integration | ⏳ Upcoming |
| 8 | AI Assistant: Proactive Alerts agent | ⏳ Upcoming |
| 9 | End-to-end testing of chat assistant | ⏳ Upcoming |
| 10 | Integration testing + bug fixes | ⏳ Upcoming |
| 11 | Documentation + report writing | ⏳ Upcoming |
| 12 | Final demo + report + PPT | ⏳ Upcoming |

---

## 🔮 Future Enhancements

Features considered but intentionally out of scope for this semester's submission:
- **Terraform (Infrastructure as Code)** — automated AWS provisioning
- **Cloud deployment** — AWS EC2/RDS or equivalent hosting
- **Auto Scaling & Load Balancing** — for handling variable traffic
- **CloudWatch-based monitoring dashboard**
- **RAG-based customer-facing support chatbot** — grounded in live product/order data
- **Multi-region deployment** for disaster recovery

---

## 📄 License

This project is developed for academic purposes under M.Sc. IT — Cloud & Application Development.

---

<div align="center">
  <b>Built with ❤️ by Bhavy Shah & Jeel Prajapati</b><br/>
  <i>M.Sc. IT | Cloud & Application Development | 2025–2026</i>
</div>
