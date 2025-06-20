#!/bin/bash

# Stop on first error
set -e

PROJECT_ROOT=$(pwd)
VENV_PATH="$PROJECT_ROOT/venv"

# Check if virtual environment exists, create if it doesn't
if [ ! -d "$VENV_PATH" ]; then
    echo "===== Creating Virtual Environment ====="
    python -m venv "$VENV_PATH"
    echo "Virtual environment created at $VENV_PATH"
fi

echo "===== Building Frontend ====="
cd "$PROJECT_ROOT/frontend"
npm install
npm run build

echo "===== Installing Backend Dependencies ====="
cd "$PROJECT_ROOT/backend"
source "$VENV_PATH/bin/activate"
pip install -r requirements.txt

echo "===== Setting up Django ====="
python manage.py migrate
python manage.py collectstatic --noinput

echo "===== Clearing port 8000 ====="
# find any PID listening on 8000 and kill it
PIDS=$(lsof -t -i:8000) || true
if [ -n "$PIDS" ]; then
    echo "Killing existing process(es) on port 8000: $PIDS"
    kill -9 $PIDS
fi

echo "===== Starting Django Server ====="
python manage.py runserver 0.0.0.0:8000
