#!/bin/bash

# Test Authentication Script for SlutWalk Denver
# Usage: MEMBER_PASSWORD='pass' ADMIN_PASSWORD='pass' ./test-auth.sh [URL]
# Defaults to http://localhost:3000 if no URL provided

BASE_URL="${1:-http://localhost:3000}"
MEMBER_PASSWORD="${MEMBER_PASSWORD:-}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

if [ -z "$MEMBER_PASSWORD" ]; then
  echo "MEMBER_PASSWORD env var is required"
  echo "  Usage: MEMBER_PASSWORD='pass' ./test-auth.sh [URL]"
  exit 1
fi

echo "Testing SlutWalk Denver Authentication"
echo "  Target: $BASE_URL"
echo "=========================================="
echo ""

echo "Testing Member Login"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"password\":\"$MEMBER_PASSWORD\"}" | jq . 2>/dev/null || echo "(response not JSON)"
echo ""

if [ -n "$ADMIN_PASSWORD" ]; then
  echo "Testing Admin Login"
  echo "--------------------------------------"
  curl -s -X POST "$BASE_URL/api/auth/admin-login" \
    -H "Content-Type: application/json" \
    -H "Origin: $BASE_URL" \
    -d "{\"password\":\"$ADMIN_PASSWORD\"}" | jq . 2>/dev/null || echo "(response not JSON)"
  echo ""
fi

echo "Testing Wrong Password"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d '{\"password\":\"wrongpassword\"}' | jq . 2>/dev/null || echo "(response not JSON)"
echo ""
echo "Done."
