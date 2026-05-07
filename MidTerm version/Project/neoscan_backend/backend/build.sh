#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Building React Frontend..."
cd ../../frontend
npm install
npm run build

echo "Copying compiled UI to Backend..."
cp -r dist ../neoscan_backend/backend/dist
echo "Build complete!"
