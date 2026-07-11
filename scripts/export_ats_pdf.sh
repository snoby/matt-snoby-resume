#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HTML="$ROOT/public/Matthew-Snoby-Resume-ATS.html"
PDF="$ROOT/public/Matthew-Snoby-Resume-ATS.pdf"

node "$ROOT/scripts/build_ats_resume.mjs" >/dev/null

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --disable-gpu \
  --run-all-compositor-stages-before-draw \
  --no-pdf-header-footer \
  --print-to-pdf="$PDF" \
  "file://$HTML" >/dev/null 2>&1

echo "$PDF"
