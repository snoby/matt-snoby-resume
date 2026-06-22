#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-matt-snoby-resume:local}"
CONTAINER_NAME="${CONTAINER_NAME:-matt-snoby-resume-local}"
API_BASE_URL="${API_BASE_URL:-http://10.0.0.85:8000}"
HOST_PORT="${HOST_PORT:-8080}"

echo "Building ${IMAGE_NAME}..."
docker build -t "${IMAGE_NAME}" .

if docker ps -a --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
  echo "Removing existing container ${CONTAINER_NAME}..."
  docker rm -f "${CONTAINER_NAME}" >/dev/null
fi

echo "Starting ${CONTAINER_NAME} on http://localhost:${HOST_PORT}"
echo "Using resume API: ${API_BASE_URL}"

docker run --rm \
  --name "${CONTAINER_NAME}" \
  -p "${HOST_PORT}:8080" \
  -e VITE_RESUME_API_BASE_URL="${API_BASE_URL}" \
  "${IMAGE_NAME}"
