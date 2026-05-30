# AI Workflow Automation Assistant

## Overview

AI Workflow Automation Assistant is a backend system that automates email management and meeting follow-ups using AI.

The platform can:
- Categorize incoming emails
- Assign priority levels
- Generate email reply drafts
- Summarize meeting transcripts
- Extract action items
- Create and assign tasks
- Suggest deadlines

The goal is to reduce manual work, improve productivity, and ensure important tasks are tracked efficiently.

---

## Features

### Email Automation
- Fetch incoming emails
- Categorize emails automatically
- Assign priority levels
- Generate AI-powered reply drafts
- User approval before sending

### Meeting Automation
- Process meeting transcripts
- Generate summaries
- Extract action items
- Create tasks automatically
- Assign owners and deadlines

### Task Management
- Create tasks from meetings
- Track task status
- Manage deadlines

---

## Workflow

### Email Processing

```text
Inbox
   ↓
AI Categorizes Email
   ↓
Assigns Priority
   ↓
Generates Reply Draft
   ↓
User Approval
   ↓
Email Sent
```

### Meeting Processing

```text
Meeting Transcript
   ↓
AI Generates Summary
   ↓
Extracts Action Items
   ↓
Creates Tasks
   ↓
Assigns Owners
   ↓
Suggests Deadlines
```

---

## Tech Stack

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Redis
- OpenAI API
- Docker
- JWT Authentication

---

## API Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
```

### Emails

```http
GET    /emails
GET    /emails/{id}
POST   /emails/{id}/analyze
POST   /emails/{id}/approve
POST   /emails/{id}/send
```

### Meetings

```http
POST   /meetings/upload
GET    /meetings/{id}
POST   /meetings/{id}/analyze
```

### Tasks

```http
GET    /tasks
POST   /tasks
PUT    /tasks/{id}
DELETE /tasks/{id}
```

---

## Installation

```bash
git clone https://github.com/your-username/ai-workflow-automation.git
cd ai-workflow-automation
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost/workflow_db
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key
```

Run the application:

```bash
docker-compose up --build
```

API Documentation:

```text
http://localhost:8000/docs
```

---

## Future Improvements

- Gmail Integration
- Outlook Integration
- Slack Notifications
- Calendar Integration
- Role-Based Access Control
- Analytics Dashboard
- Webhooks

---

## License

MIT License
