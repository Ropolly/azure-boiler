# Stage 1: Build frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Python app
FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY backend/requirements.txt /app/backend/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt && \
    pip install gunicorn

# Copy backend code
COPY backend/ /app/backend/

# Copy built frontend from the frontend stage
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Set working directory to backend
WORKDIR /app/backend

# Run migrations and collect static files
RUN python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput

# Expose ports
EXPOSE 8000

# Start server using gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
