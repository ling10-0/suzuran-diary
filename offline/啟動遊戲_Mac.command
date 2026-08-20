#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

SERVER="$DIR/mac-server"
if [ ! -f "$SERVER" ]; then
  echo "ERROR: mac-server not found. Please extract the whole ZIP before launching."
  read -n 1 -s -r -p "Press any key to close..."
  echo
  exit 1
fi

chmod +x "$SERVER" 2>/dev/null || true
xattr -d com.apple.quarantine "$SERVER" 2>/dev/null || true
xattr -d com.apple.quarantine "$0" 2>/dev/null || true

exec "$SERVER"
