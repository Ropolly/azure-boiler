# Web Boilerplate Project

A production-ready monorepo starter containing:

- **Backend**: Django REST + Whitenoise static serving
- **Frontend**: Vite + React + TypeScript
- **Containerization**: Docker + docker-compose

## Project Structure

```
web-boiler/  
├─ backend/         # Django REST Framework backend
│  ├─ api/          # API app with REST endpoints
│  ├─ auth/         # Auth app with login/signup functionality
│  ├─ core/         # Django project settings
│  ├─ Dockerfile    # Backend container definition
├─ frontend/        # React + TypeScript frontend
│  ├─ src/          # Frontend source code
│  │  ├─ assets/    # Static assets
│  │  ├─ components/# Reusable React components
│  │  ├─ pages/     # Page components
│  │  ├─ features/  # Feature-specific components
│  │  ├─ services/  # API service integration
│  │  ├─ hooks/     # Custom React hooks
│  │  ├─ utils/     # Utility functions
├─ scripts/         # Helper scripts
└─ docker-compose.yml # Container orchestration
```

## Development Setup

### Backend Setup

```bash
# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate

# Install requirements
cd backend
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## Using Docker Compose

This project can be run using Docker Compose, which sets up the entire environment including PostgreSQL database, Django backend, and React frontend.

### Prerequisites

- Docker and docker-compose installed

### Running the Application

Use the provided script to run the application:

```bash
# Development mode (with live reloading)
./scripts/run.sh dev

# Build the containers
./scripts/run.sh build

# Production mode (detached)
./scripts/run.sh prod
```

## Environment Variables

Copy the example environment file and adjust as needed:

```bash
cp backend/.env.example backend/.env
```

## Accessing the Application

- Backend API: http://localhost:8000/api/
- Admin interface: http://localhost:8000/admin/
- Frontend: http://localhost:5173/

## Note

CI/CD, Docker Hub pushes and Azure deployment will be handled separately.