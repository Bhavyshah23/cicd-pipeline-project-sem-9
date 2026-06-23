☁️ Cloud-Native CI/CD Pipeline with Auto-Scaling & Real-Time Monitoring Dashboard
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Java](https://img.shields.io/badge/Java-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Cloud%20Deployed-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Python](https://img.shields.io/badge/Python-Dashboard-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow?style=for-the-badge)
> **M.Sc. IT — Cloud & Application Development | 4-Credit Project**  
> A fully automated DevOps pipeline that builds, tests, containerizes, and deploys a Java Spring Boot application to AWS — with real-time monitoring.
---
📌 Table of Contents
About the Project
Architecture
Tech Stack
Project Modules
CI/CD Pipeline Flow
Monitoring Dashboard
Getting Started
Environment Variables
Team Members
Project Timeline
Future Enhancements
---
📖 About the Project
This project implements a production-grade DevOps system that automates the full software delivery lifecycle using industry-standard tools and AWS cloud services.
What it does:
A developer pushes code to GitHub
GitHub Actions automatically builds, tests, and scans the code
The app is packaged into a Docker container and pushed to AWS ECR
The container is deployed to AWS EC2 without any manual steps
An Auto Scaling Group adds/removes servers based on live traffic
A Python dashboard shows real-time server health and metrics
AWS SNS sends email/SMS alerts if anything goes wrong
Why it matters:
This is exactly how companies like Netflix, Amazon, and Google deploy software — thousands of times per day, automatically, with zero downtime.
---
🏗️ Architecture
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
  │         Build → Push to ECR → Deploy   │
  └─────────────────────────────────────────┘
        │
        ▼
   AWS Cloud Infrastructure
  ┌──────────────────────────────────────┐
  │         Application Load Balancer    │
  │                   │                  │
  │    ┌──────────────┼──────────────┐   │
  │    ▼              ▼              ▼   │
  │  EC2 #1        EC2 #2        EC2 #3  │
  │  (Spring)      (Spring)     (Spring) │
  │    └──────────────┼──────────────┘   │
  │              Auto Scaling            │
  │                   │                  │
  │              AWS RDS (MySQL)         │
  └──────────────────────────────────────┘
        │
        ▼
  Monitoring Layer
  ┌─────────────────────────────┐
  │  AWS CloudWatch → Python    │
  │  Flask Dashboard (Chart.js) │
  │  AWS SNS Alerts             │
  └─────────────────────────────┘
```
---
🛠️ Tech Stack
Layer	Technology	Purpose
Backend	Java 17, Spring Boot, Maven	REST API application
Database	MySQL, AWS RDS	Cloud-managed database
Containerization	Docker, AWS ECR	Package & store images
CI/CD	GitHub Actions, SonarQube	Automation & code quality
Cloud Compute	AWS EC2, Auto Scaling Group	App hosting & scaling
Load Balancing	AWS ALB	Traffic distribution
Storage	AWS S3	Logs & static files
Monitoring	AWS CloudWatch	Metrics collection
Dashboard	Python, Flask, Chart.js	Real-time monitoring UI
Alerts	AWS SNS	Email/SMS notifications
Version Control	Git, GitHub	Source code management
---
📦 Project Modules
Module 1 — Spring Boot REST API (Member B)
CRUD REST API built with Spring Boot
Connected to AWS RDS (MySQL) database
Unit tested with JUnit
Endpoints: `GET /products`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`
Module 2 — CI/CD Pipeline (Member A)
Automated GitHub Actions workflow
Stages: Build → Test → SonarQube → Docker Build → Push ECR → Deploy EC2
Triggers on every push to `main` branch
Pipeline status visible on GitHub Actions tab
Module 3 — AWS Cloud Infrastructure (Member A)
EC2 instances running Docker containers
Application Load Balancer distributing traffic
Auto Scaling Group scaling between 1–3 instances based on CPU
AWS RDS for managed database
AWS SNS for automated alerts
Module 4 — Monitoring Dashboard (Member B)
Python Flask web app
Fetches live metrics from AWS CloudWatch using boto3
Chart.js graphs: CPU usage, request count, response time
Deployment history log
Active instance counter
Alert panel for threshold breaches
---
🔄 CI/CD Pipeline Flow
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
    │       └── SonarQube scan
    │
    ├── Stage 4: Docker Build
    │       └── docker build -t app .
    │
    ├── Stage 5: Push to ECR
    │       └── docker push → AWS ECR
    │
    └── Stage 6: Deploy
            └── SSH into EC2 → docker pull → docker run
```
Pipeline Status: 🟡 In Progress (Week 5)
---
📊 Monitoring Dashboard
The dashboard displays the following real-time widgets:
Widget	Metric	Source
CPU Usage Graph	% per EC2 instance (live)	AWS CloudWatch
Request Count	API calls per minute	AWS CloudWatch
Response Time	Average latency in ms	AWS CloudWatch
Active Instances	Number of running EC2s	AWS Auto Scaling
Deployment Log	Recent deploys with pass/fail	GitHub Actions API
Alert Panel	Active warnings & errors	AWS CloudWatch Alarms
---
🚀 Getting Started
Prerequisites
Make sure you have these installed:
```
Java 17+
Maven 3.8+
Docker Desktop
Python 3.10+
AWS CLI (configured with IAM credentials)
Git
```
Clone the Repository
```bash
git clone https://github.com/YOUR_ORG/cicd-pipeline-project.git
cd cicd-pipeline-project
```
Run the Spring Boot App Locally
```bash
cd app
mvn clean install
mvn spring-boot:run
```
API will be available at: `http://localhost:8080`
Run with Docker Locally
```bash
docker build -t cicd-app .
docker run -p 8080:8080 cicd-app
```
Run the Monitoring Dashboard Locally
```bash
cd dashboard
pip install -r requirements.txt
python app.py
```
Dashboard will be available at: `http://localhost:5000`
---
🔐 Environment Variables
Create a `.env` file in the root directory (never commit this to GitHub):
```env
# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_NAME=cicddb
DB_USERNAME=admin
DB_PASSWORD=your_password

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1

# SNS
SNS_TOPIC_ARN=arn:aws:sns:ap-south-1:your_topic
```
> ⚠️ **Important:** Add `.env` to your `.gitignore` — never push credentials to GitHub.
---
👥 Team Members
Name	Role	Responsibilities
[Member A Name]	DevOps Engineer	GitHub Actions, Docker, AWS ECR, EC2, Load Balancer, Auto Scaling, SNS
[Member B Name]	Developer & Monitor	Spring Boot API, AWS RDS, Python Dashboard, CloudWatch
Institution: [CPC, Gujarat University]  
Program: M.Sc. Information Technology  
Subject: Cloud & Application Development  
Academic Year: 2025–2026
---
📅 Project Timeline
Week	Milestone	Status
1	GitHub setup + AWS account + Spring Boot project created	✅ Done
2	Pipeline build/test stages + API local testing	🔄 In Progress
3	SonarQube stage + API connected to RDS	⏳ Upcoming
4	Docker build in pipeline + Dockerfile complete	⏳ Upcoming
5	Docker push to ECR + EC2 launch	⏳ Upcoming
6	Auto deploy to EC2 + Flask dashboard start	⏳ Upcoming
7	Load Balancer + Auto Scaling + CloudWatch dashboard	⏳ Upcoming
8	SNS alerts + dashboard graphs complete	⏳ Upcoming
9	Load testing + auto scaling verification	⏳ Upcoming
10	Full end-to-end testing	⏳ Upcoming
11	Integration testing + bug fixes	⏳ Upcoming
12	Final demo + report + PPT	⏳ Upcoming
---
🔮 Future Enhancements
Features planned for future versions beyond this academic submission:
Terraform — Infrastructure as Code for automated AWS provisioning
Kubernetes (EKS) — Container orchestration for larger scale
Multi-region deployment — Disaster recovery across AWS regions
Grafana integration — Advanced monitoring dashboards
Slack notifications — Pipeline alerts directly in team chat
Blue/Green deployment — Zero-downtime deployment strategy
---
📄 License
This project is developed for academic purposes under M.Sc. IT — Cloud & Application Development.
---
<div align="center">
  <b>Built with ❤️ by [Member A Name] & [Member B Name]</b><br/>
  <i>M.Sc. IT | Cloud & Application Development | 2025–2026</i>
</div>