#!/bin/bash
set -e

# Clear pip cache to ensure fresh install
pip cache purge

# Install with no cache
pip install --no-cache-dir --only-binary :all: -r backend/requirements.txt || pip install --no-cache-dir -r backend/requirements.txt

echo "Build completed successfully"
