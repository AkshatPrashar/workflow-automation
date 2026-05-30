# AI Workflow Automation Assistant Backend

A production-ready Python backend powered by FastAPI, PostgreSQL, SQLAlchemy ORM, Redis, Celery, and OpenAI GPT-4o-mini. The platform automates inbox email triage and extracts structured action items/summaries from meeting transcripts.

---

## Architecture Highlights
- **Clean Architecture**: Strong isolation between Database Models, Pydantic Input/Output Schemas, Repositories, Business Logic Services, and FastAPI Controllers.
- **Asynchronous Processing**: FastAPI handlers use modern async database connections (`asyncpg` & `SQLAlchemy 2.0 async sessions`).
- **Asynchronous Task Queue**: Celery executes email fetching and deep NLP analysis asynchronously via Redis brokers, preventing HTTP requests blocking.
- **Robust NLP Service**: Integrates OpenAI's latest API client, with built-in mock response fallbacks for offline testing.

---

## Folder Structure
```
ai_workflow_assistant/
├── app/
│   ├── api/
│   │   ├── deps.py             # Auth & db session injections
│   │   └── v1/
│   │       ├── auth.py         # Login & registration endpoints
│   │       ├── emails.py       # Triage, draft, and SMTP send endpoints
│   │       ├── meetings.py     # Transcripts parsing, summary endpoints
│   │       └── tasks.py        # CRUD action items
│   ├── models/                 # SQLAlchemy 2.0 DB models
│   ├── repositories/           # Isolated database query layer (async CRUD)
│   ├── schemas/                # Pydantic validation & serialization
│   ├── services/
│   │   ├── ai.py               # OpenAI prompting & mock fallbacks
│   │   ├── auth.py             # Password hashing and JWT generation
│   │   └── email.py            # IMAP unread fetching & SMTP dispatchers
│   ├── config.py               # Base pydantic settings module
│   ├── db.py                   # Async Engine & Session maker
│   ├── main.py                 # FastAPI application boots
│   └── worker.py               # Celery app tasks handlers
├── tests/
│   └── test_api.py             # pytest suite with overrides
├── Dockerfile                  # Slim Docker config
├── docker-compose.yml          # Postgres, Redis, API, Worker, and Beat
├── requirements.txt            # Package dependencies list
├── .env                        # Configuration file
└── README.md                   # Complete developer guide
```

---

## Setup & Running Locally

### Prerequisites
1. **Python**: Python 3.10 or 3.11
2. **Services**: PostgreSQL & Redis (or use Docker Compose)

### Manual Installation
1. Navigate to the project folder:
   ```bash
   cd C:\Users\Chandra\.gemini\antigravity\scratch\ai_workflow_assistant
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment:
   ```bash
   copy .env.example .env
   ```
5. Launch services:
   Ensure local PostgreSQL and Redis servers are running. The FastAPI application automatically bootstraps database schemas on startup.
6. Launch API server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
7. Launch Celery Worker:
   ```bash
   celery -A app.worker.celery_app worker --loglevel=info -P solo
   ```
8. Run automated tests:
   ```bash
   pytest
   ```

---

## Containerized Launch (Recommended)
Launch the entire infrastructure stack using Docker Compose:
```bash
docker-compose up --build
```
This starts PostgreSQL, Redis, the API server, a Celery worker, and a Celery beat periodic scheduler.

---

## Sample API Requests & Responses

### 1. Authentication

#### Register a New User
- **Endpoint**: `POST /auth/register`
- **Request**:
```json
{
  "name": "Alex Mercer",
  "email": "alex.mercer@company.com",
  "password": "supersecurepassword123"
}
```
- **Response** (201 Created):
```json
{
  "id": 1,
  "name": "Alex Mercer",
  "email": "alex.mercer@company.com"
}
```

#### Log In to Receive JWT Token
- **Endpoint**: `POST /auth/login`
- **Request** (Form Data):
  - `username`: `alex.mercer@company.com`
  - `password`: `supersecurepassword123`
- **Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Alex Mercer",
    "email": "alex.mercer@company.com"
  }
}
```

*Note: All endpoints below require the header: `Authorization: Bearer <access_token>`*

---

### 2. Email Automation

#### Fetch & List Emails
- **Endpoint**: `GET /emails`
- **Response** (200 OK):
```json
[
  {
    "id": 1,
    "sender": "support-ticket@customer.com",
    "subject": "URGENT: Database login is broken",
    "body": "Hi, I am unable to login to the database server. It keeps returning connection timeout. Please look into this immediately as our production environment is completely down! ASAP!",
    "category": "Support",
    "priority": "High",
    "draft_reply": "Hello,\n\nThank you for reaching out. We have received your request regarding this matter. Our team is currently reviewing the details and will get back to you shortly with next steps.\n\nBest regards,\nAI Automation Assistant",
    "status": "Analyzed",
    "created_at": "2026-05-30T12:00:00Z"
  }
]
```

#### Re-analyze Email
- **Endpoint**: `POST /emails/{id}/analyze`
- **Response** (200 OK):
```json
{
  "id": 1,
  "sender": "support-ticket@customer.com",
  "subject": "URGENT: Database login is broken",
  "body": "...",
  "category": "Support",
  "priority": "High",
  "draft_reply": "...",
  "status": "Pending",
  "created_at": "2026-05-30T12:00:00Z"
}
```
*(Triggers background analysis, changing status back to Pending until completed by the worker.)*

#### Approve and Update Draft
- **Endpoint**: `POST /emails/{id}/approve`
- **Request**:
```json
{
  "draft_reply": "Hello. I have notified our on-call infrastructure engineers. We are restarting the replica cluster right now."
}
```
- **Response** (200 OK):
```json
{
  "id": 1,
  "sender": "support-ticket@customer.com",
  "subject": "URGENT: Database login is broken",
  "body": "...",
  "category": "Support",
  "priority": "High",
  "draft_reply": "Hello. I have notified our on-call infrastructure engineers. We are restarting the replica cluster right now.",
  "status": "Approved",
  "created_at": "2026-05-30T12:00:00Z"
}
```

#### Dispatch SMTP Reply
- **Endpoint**: `POST /emails/{id}/send`
- **Response** (200 OK):
```json
{
  "message": "Email sent successfully."
}
```

---

### 3. Meetings & Transcripts

#### Upload Transcript
- **Endpoint**: `POST /meetings/upload`
- **Request**:
```json
{
  "title": "Roadmap Q3 Sync",
  "transcript": "Alice: I will draft the backend API documentation by next Friday. Bob: Great, I will focus on implementing the integration test suite and make sure it builds in CI. Alice: Awesome. Charlie, can you confirm the SMTP servers? Charlie: Yes, I will verify the production SMTP settings by next Tuesday."
}
```
- **Response** (201 Created):
```json
{
  "id": 1,
  "title": "Roadmap Q3 Sync",
  "transcript": "Alice: I will...",
  "summary": null,
  "created_at": "2026-05-30T12:10:00Z",
  "tasks": []
}
```

#### Analyze Transcript (Summarize & Action items)
- **Endpoint**: `POST /meetings/{id}/analyze`
- **Response** (200 OK):
```json
{
  "id": 1,
  "title": "Roadmap Q3 Sync",
  "transcript": "Alice: I will...",
  "summary": "# Meeting Summary\n\n## Objective\nThe team met to coordinate progress...",
  "created_at": "2026-05-30T12:10:00Z",
  "tasks": [
    {
      "id": 1,
      "meeting_id": 1,
      "task_name": "Draft API documentation",
      "owner": "Alice",
      "deadline": "2026-06-05",
      "status": "Pending"
    },
    {
      "id": 2,
      "meeting_id": 1,
      "task_name": "Implement integration test suite",
      "owner": "Bob",
      "deadline": "2026-06-10",
      "status": "Pending"
    },
    {
      "id": 3,
      "meeting_id": 1,
      "task_name": "Configure SMTP production server credentials",
      "owner": "Charlie",
      "deadline": "2026-06-02",
      "status": "Pending"
    }
  ]
}
```

---

### 4. Tasks (Action Items)

#### List Active Tasks
- **Endpoint**: `GET /tasks?status=Pending&owner=Alice`
- **Response** (200 OK):
```json
[
  {
    "id": 1,
    "meeting_id": 1,
    "task_name": "Draft API documentation",
    "owner": "Alice",
    "deadline": "2026-06-05",
    "status": "Pending"
  }
]
```

#### Update Task Status
- **Endpoint**: `PUT /tasks/{id}`
- **Request**:
```json
{
  "status": "Completed"
}
```
- **Response** (200 OK):
```json
{
  "id": 1,
  "meeting_id": 1,
  "task_name": "Draft API documentation",
  "owner": "Alice",
  "deadline": "2026-06-05",
  "status": "Completed"
}
```
