# Use official lightweight Python image
FROM python:3.11-slim

# Set environment system configurations
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on

# Set standard application workspace
WORKDIR /workspace

# Install system dependencies needed for compiling certs or postgres drivers if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy application source code
COPY . .

# Expose API port
EXPOSE 8000

# Command to launch web API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
