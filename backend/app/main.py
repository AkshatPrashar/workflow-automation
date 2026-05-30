import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import engine, Base
# Import models to ensure they register on the declarative base
from app.models import User, Email, Meeting, Task

from app.api.v1.auth import router as auth_router
from app.api.v1.emails import router as emails_router
from app.api.v1.meetings import router as meetings_router
from app.api.v1.tasks import router as tasks_router

# Setup logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler to bootstrap the database tables on application start."""
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized successfully.")
    yield
    logger.info("Shutting down application...")
    await engine.dispose()

# Define application
app = FastAPI(
    title="AI Workflow Automation Assistant API",
    description="Production-ready FastAPI backend integrating email processing and meeting transcript analysis.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for standard browser calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all endpoint routers
app.include_router(auth_router)
app.include_router(emails_router)
app.include_router(meetings_router)
app.include_router(tasks_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Workflow Automation Assistant",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
