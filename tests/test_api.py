import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

# Mock the database engine initialization on import before importing the app
with patch("app.db.engine"), patch("app.db.AsyncSessionLocal"):
    from app.main import app
    from app.db import get_db
    from app.api.deps import get_current_user
    from app.models.user import User

client = TestClient(app)

# Helper mock for standard User model
mock_user = User(
    id=1,
    name="Test User",
    email="test@user.com",
    password_hash="hashedpassword"
)

# Set dependency override for authentication to mock user
app.dependency_overrides[get_current_user] = lambda: mock_user

@pytest.fixture
def mock_db():
    db_session = AsyncMock()
    # Override get_db to return this session mock
    app.dependency_overrides[get_db] = lambda: db_session
    yield db_session
    # Clean up overrides
    app.dependency_overrides.pop(get_db, None)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

@patch("app.repositories.user.UserRepository.get_by_email")
@patch("app.repositories.user.UserRepository.create")
def test_register_user(mock_create, mock_get_by_email, mock_db):
    # Setup mock behavior
    mock_get_by_email.return_value = None
    mock_create.return_value = mock_user

    payload = {
        "name": "Test User",
        "email": "test@user.com",
        "password": "securepassword123"
    }
    # Temporarily remove get_current_user override for register if any, but register doesn't use it
    response = client.post("/auth/register", json=payload)
    
    assert response.status_code == 201
    assert response.json()["email"] == "test@user.com"
    assert "id" in response.json()

@patch("app.repositories.task.TaskRepository.get_tasks")
def test_get_tasks(mock_get_tasks, mock_db):
    # Setup list response
    mock_get_tasks.return_value = [
        MagicMock(id=1, meeting_id=1, task_name="Review PR", owner="Alice", deadline=None, status="Pending")
    ]

    response = client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["task_name"] == "Review PR"

@patch("app.repositories.email.EmailRepository.get_emails")
def test_list_emails(mock_get_emails, mock_db):
    mock_get_emails.return_value = [
        MagicMock(id=1, sender="test@sender.com", subject="Hello", body="Content", category="Other", priority="Low", status="Pending", created_at=None)
    ]

    response = client.get("/emails")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["sender"] == "test@sender.com"
