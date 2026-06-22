#!/bin/sh
set -eu

API_URL="${VITE_RESUME_API_BASE_URL:-http://10.0.0.85:8000}"
ESCAPED_API_URL=$(printf '%s' "$API_URL" | sed 's/\\/\\\\/g; s/"/\\"/g')

cat > /tmp/config.js <<EOF
window.__APP_CONFIG__ = {
  RESUME_API_BASE_URL: "${ESCAPED_API_URL}"
}
EOF
