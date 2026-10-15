#!/usr/bin/env bash
# ==============================================================================
# AquaBophelo End-to-End Persona & Operational Workflow Verification Suite (cURL)
# ==============================================================================

set -euo pipefail

BASE_URL="${1:-http://localhost:5094}"
ADMIN_EMAIL="${2:-admin@aquabophelo.app}"
ADMIN_PASSWORD="${3:-}"

echo "=========================================================="
echo "  AquaBophelo End-to-End Workflow Verification Suite"
echo "  Target Host: ${BASE_URL}"
echo "  Timestamp:   $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "=========================================================="

PASSED=0
FAILED=0
TOTAL=0

run_check() {
    local title="$1"
    local command="$2"
    TOTAL=$((TOTAL + 1))
    printf "\n[CHECK %d] %s... " "$TOTAL" "$title"
    
    if eval "$command"; then
        printf "[PASS]\n"
        PASSED=$((PASSED + 1))
    else
        printf "[FAIL]\n"
        FAILED=$((FAILED + 1))
    fi
}

# 1. Database & Message Queue Readiness Probe
run_check "Database & Message Queue Readiness Probe (/health/ready)" \
    "curl -s -f -o /dev/null -w '%{http_code}' '${BASE_URL}/health/ready' | grep -q '200'"

# 2. Resident Discovery & Telemetry Workflows
run_check "Resident Telemetry: Municipal Reservoirs (GET /api/v1/dams)" \
    "curl -s -f '${BASE_URL}/api/v1/dams' | grep -q 'Newton Reservoir'"

run_check "Resident Discovery: Municipal Supply Areas (GET /api/v1/areas)" \
    "curl -s -f '${BASE_URL}/api/v1/areas' | grep -q 'Galeshewe'"

run_check "Resident Telemetry: Active Municipal Alerts (GET /api/v1/alerts)" \
    "curl -s -f -o /dev/null -w '%{http_code}' '${BASE_URL}/api/v1/alerts' | grep -q '200'"

# 3. OTP Dispatch & Email Worker Delivery Pipeline
run_check "Resident Registration: OTP Code Dispatch (POST /api/v1/auth/send-otp)" \
    "curl -s -f -X POST '${BASE_URL}/api/v1/auth/send-otp' -H 'Content-Type: application/json' -d '{\"email\":\"resident.ci.test@solplaatje.org.za\",\"purpose\":\"EmailVerification\"}' | grep -q 'success'"

# 4. SignalR Real-Time Fleet & Ping Transports
run_check "SignalR Telemetry Engine: Public Ping Negotiation (/hubs/ping/negotiate)" \
    "curl -s -X POST '${BASE_URL}/hubs/ping/negotiate?negotiateVersion=1' | grep -q 'connectionId'"

# 5. Security Gates & Role Boundaries
run_check "Security Boundary: Live Tanker Hub Requires Authentication (/hubs/trucks/negotiate)" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST '${BASE_URL}/hubs/trucks/negotiate?negotiateVersion=1' | grep -q '401'"

run_check "Security Boundary: Municipal Subscriptions Require Auth (GET /api/v1/subscriptions)" \
    "curl -s -o /dev/null -w '%{http_code}' '${BASE_URL}/api/v1/subscriptions' | grep -q '401'"

run_check "Security Boundary: Modifying Municipal Tankers Requires Admin (POST /api/v1/trucks)" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST '${BASE_URL}/api/v1/trucks' -H 'Content-Type: application/json' -d '{\"licensePlate\":\"NC123456\"}' | grep -q '401'"

# 6. Admin Command Center Operational Analytics
run_check "Admin Operations: High-Level Analytics Summary (GET /api/v1/reports/summary)" \
    "curl -s -f '${BASE_URL}/api/v1/reports/summary' | grep -q 'totalDams'"

run_check "Admin Fleet Inventory: Query Municipal Water Tankers (GET /api/v1/trucks)" \
    "curl -s -f -o /dev/null -w '%{http_code}' '${BASE_URL}/api/v1/trucks' | grep -q '200'"

# Optional: Admin Authentication if password provided
if [ -n "$ADMIN_PASSWORD" ]; then
    run_check "Admin Persona: Master Authentication & JWT Issuance (POST /api/v1/auth/login)" \
        "curl -s -f -X POST '${BASE_URL}/api/v1/auth/login' -H 'Content-Type: application/json' -d '{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}' | grep -q 'token'"
fi

echo ""
echo "=========================================================="
echo "  Workflow Results: ${PASSED} Passed, ${FAILED} Failed (Total: ${TOTAL})"
echo "=========================================================="

if [ "$FAILED" -gt 0 ]; then
    exit 1
fi
exit 0
