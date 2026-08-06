#!/bin/bash

# Test Authentication Script for SlutWalk Denver
# This script tests the login endpoints with the configured passwords

echo "🔍 Testing SlutWalk Denver Authentication"
echo "=========================================="
echo ""

# Start the development server in the background if not already running
if ! lsof -i :3000 > /dev/null; then
    echo "🚀 Starting Next.js development server..."
    npm run dev &
    sleep 5
fi

BASE_URL="http://localhost:3000"

echo "📡 Testing Member Login (GurlGang2030!)"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d '{"password":"GurlGang2030!"}' | jq .

echo ""
echo "📡 Testing Admin Login (Y2K!W3r)"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL/api/auth/admin-login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d '{"password":"Y2K!W3r"}' | jq .

echo ""
echo "📡 Testing Wrong Password"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d '{"password":"wrongpassword"}' | jq .

echo ""
echo "✅ Authentication tests complete!"
