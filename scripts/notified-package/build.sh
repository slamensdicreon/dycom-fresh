#!/usr/bin/env bash
# Build the Investors page package for Notified (Dycom's IR platform partner).
#
#   npm run package:notified               build the site, then package
#   npm run package:notified -- --no-build package the existing .next build
#
# Output: exports/Dycom-Investors-Page-Notified/ and exports/Dycom-Investors-Page-Notified-<date>.zip
# Needs: Playwright with Chromium (require('playwright') must resolve), Python 3 with
# beautifulsoup4, and zip. See README.md beside this script.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
NAME="Dycom-Investors-Page-Notified"
OUT_DIR="$REPO/exports"
PKG="$OUT_DIR/$NAME"
SITE_PORT="${SITE_PORT:-3170}"
PKG_PORT="${PKG_PORT:-3171}"
WORK="$(mktemp -d)"
PIDS=()
cleanup() { for p in "${PIDS[@]:-}"; do [ -n "$p" ] && kill "$p" 2>/dev/null || true; done; rm -rf "$WORK"; }
trap cleanup EXIT

wait_for() { for _ in $(seq 1 60); do curl -fsS -o /dev/null "$1" 2>/dev/null && return 0; sleep 1; done; echo "timed out waiting for $1" >&2; exit 1; }

cd "$REPO"
if [ "${1:-}" != "--no-build" ]; then
  echo "1/5 Building the site"
  npm run build
else
  [ -f .next/BUILD_ID ] || { echo "No .next build found; run without --no-build." >&2; exit 1; }
  echo "1/5 Using the existing build"
fi

echo "2/5 Starting the site on port $SITE_PORT and capturing the Investors page"
npx next start -p "$SITE_PORT" > "$WORK/site.log" 2>&1 &
PIDS+=($!)
wait_for "http://localhost:$SITE_PORT/investors/"
node "$HERE/capture.mjs" "http://localhost:$SITE_PORT" "$WORK/capture.json"

echo "3/5 Assembling the package"
mkdir -p "$OUT_DIR"
python3 "$HERE/assemble.py" "$WORK/capture.json" "$PKG"

echo "4/5 Checking the package and taking reference screenshots"
mkdir -p "$PKG/screenshots"
python3 -m http.server "$PKG_PORT" -d "$PKG" > "$WORK/pkg.log" 2>&1 &
PIDS+=($!)
wait_for "http://localhost:$PKG_PORT/"
node "$HERE/screenshots.mjs" "http://localhost:$PKG_PORT/" "$PKG/screenshots"

echo "5/5 Zipping"
ZIP="$OUT_DIR/$NAME-$(date +%Y-%m-%d).zip"
rm -f "$ZIP"
(cd "$OUT_DIR" && zip -qr -X "$ZIP" "$NAME")
echo "Done: $ZIP ($(du -h "$ZIP" | cut -f1))"
