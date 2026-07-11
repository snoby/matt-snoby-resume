#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="${IMAGE_NAME:-iotapi322/resume}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
REQUIRED_FILES=(
  "public/Matthew-Snoby-Resume.pdf"
  "public/Matthew-Snoby-Resume.docx"
  "public/Matthew-Snoby-Resume-SRE.html"
  "public/Matthew-Snoby-Resume-SRE.pdf"
)

cd "$ROOT"

if [[ -f "scripts/build_ats_resume.mjs" ]]; then
  npm run build:resume:html
fi

for path in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "Missing required static resume asset: $path" >&2
    echo "Generate or add the file before building so the reverse-proxied site can serve it." >&2
    exit 1
  fi
done

npm ci --no-audit --no-fund
npm run lint
npm run build

docker build \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  "$ROOT"

echo "Built ${IMAGE_NAME}:${IMAGE_TAG}"
