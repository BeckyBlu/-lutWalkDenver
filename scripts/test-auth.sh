#!/bin/bash
set -uo pipefail

# Test Authentication Script for SlutWalk Denver
# Usage: MEMBER_PASSWORD='pass' ADMIN_PASSWORD='pass' ./scripts/test-auth.sh [URL]
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

PASS=0
FAIL=0

# Helper: safely build JSON password payload
make_payload() {
  local pw="$1"
  printf '{"password":"%s"}' "$(printf '%s' "$pw" | sed 's/\\/\\\\/g; s/"/\\"/g')"
}

# Test 1: Member login (POST)
echo "Test 1: Member login (POST /api/auth/login)"
echo "-------------------------------------------"
PAYLOAD=$(make_payload "$MEMBER_PASSWORD")
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "$PAYLOAD" 2>/dev/null) || HTTP_CODE="000"
if [ "$HTTP_CODE" = "200" ]; then echo "  PASS (200)"; PASS=$((PASS+1)); else echo "  FAIL (expected 200, got $HTTP_CODE)"; FAIL=$((FAIL+1)); fi
echo ""

# Test 2: Wrong password rejected (401)
echo "Test 2: Wrong password rejected"
echo "-------------------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d '{"password":"definitely-wrong-12345"}' 2>/dev/null) || HTTP_CODE="000"
if [ "$HTTP_CODE" = "401" ]; then echo "  PASS (401)"; PASS=$((PASS+1)); else echo "  FAIL (expected 401, got $HTTP_CODE)"; FAIL=$((FAIL+1)); fi
echo ""

# Test 3: GET method not allowed (405)
echo "Test 3: GET rejected (should be 405)"
echo "-------------------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/auth/login" \
  -H "Origin: $BASE_URL" 2>/dev/null) || HTTP_CODE="000"
if [ "$HTTP_CODE" = "405" ]; then echo "  PASS (405)"; PASS=$((PASS+1)); else echo "  WARN (expected 405, got $HTTP_CODE) - static server?"; FAIL=$((FAIL+1)); fi
echo ""

# Test 4: Password trim (whitespace should still work)
echo "Test 4: Password trim (whitespace)"
echo "-------------------------------------------"
TRIMMED="  $MEMBER_PASSWORD  "
PAYLOAD=$(make_payload "$TRIMMED")
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "$PAYLOAD" 2>/dev/null) || HTTP_CODE="000"
if [ "$HTTP_CODE" = "200" ]; then echo "  PASS (200)"; PASS=$((PASS+1)); else echo "  FAIL (expected 200, got $HTTP_CODE)"; FAIL=$((FAIL+1)); fi
echo ""

# Test 5: Admin login (if ADMIN_PASSWORD provided)
if [ -n "$ADMIN_PASSWORD" ]; then
  echo "Test 5: Admin login (POST /api/auth/admin-login)"
  echo "-------------------------------------------"
  PAYLOAD=$(make_payload "$ADMIN_PASSWORD")
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/admin-login" \
    -H "Content-Type: application/json" \
    -H "Origin: $BASE_URL" \
    -d "$PAYLOAD" 2>/dev/null) || HTTP_CODE="000"
  if [ "$HTTP_CODE" = "200" ]; then echo "  PASS (200)"; PASS=$((PASS+1)); else echo "  FAIL (expected 200, got $HTTP_CODE)"; FAIL=$((FAIL+1)); fi
  echo ""
fi

echo "=========================================="
echo "Results: $PASS passed, $FAIL failed"
if [ "$FAIL" -gt 0 ]; then exit 1; fi
echo "All tests passed."
