#!/bin/bash

set -e

cd "$(dirname "$0")/.."  # Move to project root directory

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 {dev|build|prod}"
    echo "  dev   - Start development environment (docker-compose up --build)"
    echo "  build - Build containers (docker-compose build)"
    echo "  prod  - Start production environment (docker-compose up -d)"
    exit 1
 fi

case "$1" in
  dev)
    echo "Starting development environment..."
    docker-compose up --build
    ;;
  build)
    echo "Building containers..."
    docker-compose build
    ;;
  prod)
    echo "Starting production environment..."
    docker-compose up -d
    ;;
  *)
    echo "Invalid argument: $1"
    echo "Usage: $0 {dev|build|prod}"
    exit 1
    ;;
esac