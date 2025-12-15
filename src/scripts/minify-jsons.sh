#!/bin/bash

# minify-jsons.sh
# Script to minify JSON files in the public/metadata/customer/individual directory

# Get the project root directory (assuming script is in src/scripts)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
JSON_DIR="$PROJECT_ROOT/public"

echo "Minifying JSON files in: $JSON_DIR"

# Process each JSON file recursively in the directory
find "$JSON_DIR" -name "*.json" -type f | while read -r json_file; do
    filename=$(basename "$json_file")
    echo "Minifying $filename..."
    jq -c . "$json_file" > "$json_file.tmp" && mv "$json_file.tmp" "$json_file"
done

echo "Done!"