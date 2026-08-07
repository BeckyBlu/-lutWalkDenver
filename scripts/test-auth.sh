#!/bin/bash
set -euo pipefail

# Test Authentication Script for SlutWalk Denver
# Usage: MEMBER_PASSWORD='your-pass' ./scripts/test-auth.sh [URL]
# Defaults to http://localhost:3000 if no URL provided

BASE_URL="${1:-http://localhost:3000}"
MEMBER_PASSWORD="${MEMBER_PASSWORD:-}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

if [ -z "$MEMBER_PASSWORD" ]; then
  echo "MEMBER_PASSWORD env var is required"
  echo "  Usage: MEMBER_PASSWORD='pass' ./scripts/test-auth.sh [URL]"
  exit 1
fi

echo "Testing SlutWalk Denver Authentication"
echo "  Target: $BASE_URL"
echo "=========================================="
echo ""

# Test 1: Member login (POST)
echo "Test 1: Member login (POST /api/auth/login)"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"password\":\"$MEMBER_PASSWORD\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "200" ]; then echo "  PASS (200)"; else echo "  FAIL (expected 200, got $HTTP_CODE)"; fi
echo ""

# Test 2: Wrong password rejected
echo "Test 2: Wrong password rejected (401)"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d '{\"password\":\"definitely-wrong-12345\"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then echo "  PASS (401)"; else echo "  FAIL (expected 401, got $HTTP_CODE)"; fi
echo ""

# Test 3: GET method not allowed (405)
echo "Test 3: GET rejected (should be 405)"
echo "-------------------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/auth/login" -H "Origin: $BASE_URL")
if [ "$HTTP_CODE" = "405" ]; then echo "  PASS (405)"; else echo "  WARN (expected 405, got $HTTP_CODE) — static server?"; fi
echo ""

# Test 4: Password trim
echo "Test 4: Password trim (whitespace)"
echo "-------------------------------------------"
TRIMMED="  $MEMBER_PASSWORD  "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"password\":\"$TRIMMED\"}")
if [ "$HTTP_CODE" = "200" ]; then echo "  PASS (200)"; else echo "  FAIL (expected 200, got $HTTP_CODE)"; fi
echo ""

# Test 5: Admin login
if [ -n "$ADMIN_PASSWORD" ]; then
  echo "Test 5: Admin login (POST /api/auth/admin-login)"
  echo "-------------------------------------------"
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/admin-login" \
    -H "Content-Type: application/json" \
    -H "Origin: $BASE_URL" \
    -d "{\"password\":\"$ADMIN_PASSWORD\"}")
  if [ "$HTTP_CODE" = "200" ]; then echo "  PASS (200)"; else echo "  FAIL (expected 200, got $HTTP_CODE)"; fi
  echo ""
fi

echo "Done. If 405/connection errors on production, deploy to Node.js (see docs/deployment-runbook.md)."
