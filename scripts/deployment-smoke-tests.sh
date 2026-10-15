#!/usr/bin/env bash
# ==============================================================================
# AquaBophelo Production & Staging Deployment Smoke Test Suite (Bash/cURL)
# ==============================================================================

set -euo pipefail

BASE_URL="${1:-http://localhost:5094}"

echo "=========================================================="
echo "  AquaBophelo Deployment Smoke Test Suite (cURL)"
echo "  Target:   ${BASE_URL}"
echo "  Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "=========================================================="

PASSED=0
FAILED=0
TOTAL=0

run_check() {
    local title="$1"
    local command="$2"
    TOTAL=$((TOTAL + 1))
    printf "\n[TEST %d] %s... " "$TOTAL" "$title"
    
    if eval "$command"; then
        printf "[PASS]\n"
        PASSED=$((PASSED + 1))
    else
        printf "[FAIL]\n"
        FAILED=$((FAILED + 1))
    fi
}

# 1. Liveness Probe
run_check "Kubernetes/Container Liveness Probe (GET /health/live)" \
    "curl -s -f -o /dev/null -w '%{http_code}' '${BASE_URL}/health/live' | grep -q '200'"

# 2. Database & Message Queue Readiness Probe
run_check "System Readiness Probe (GET /health/ready)" \
    "curl -s -f -o /dev/null -w '%{http_code}' '${BASE_URL}/health/ready' | grep -q '200'"

# 3. Detailed API Controller Health
run_check "API Controller Health Diagnostics (GET /api/v1/health)" \
    "curl -s -f -o /dev/null -w '%{http_code}' '${BASE_URL}/api/v1/health' | grep -q '200'"

# 4. Mandatory Security Headers Verification
run_check "HTTP Security Headers Enforcement" \
    "curl -s -I '${BASE_URL}/api/v1/health' | grep -i -E 'X-Content-Type-Options: nosniff|X-Frame-Options: DENY|Referrer-Policy: strict-origin-when-cross-origin'"

# 5. SignalR Hub Negotiation
run_check "SignalR Fleet Hub Negotiation (POST /hubs/trucks/negotiate)" \
    "curl -s -X POST '${BASE_URL}/hubs/trucks/negotiate?negotiateVersion=1' | grep -q 'connectionId'"

# 6. Authentication Gate: Protected Endpoint Requires Authentication
run_check "Security Gate: Protected Endpoint Rejection (GET /api/v1/trucks)" \
    "curl -s -o /dev/null -w '%{http_code}' '${BASE_URL}/api/v1/trucks' | grep -q '401'"

# 7. Authentication Gate: Rejection of Invalid Credentials
run_check "Security Gate: Rejection of Invalid Login (POST /api/v1/auth/login)" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST '${BASE_URL}/api/v1/auth/login' -H 'Content-Type: application/json' -d '{\"email\":\"bad@invalid.test\",\"password\":\"WrongPassword!\"}' | grep -E -q '400|401'"

echo ""
echo "=========================================================="
echo "  Smoke Test Results: ${PASSED} Passed, ${FAILED} Failed (Total: ${TOTAL})"
echo "=========================================================="

if [ "$FAILED" -gt 0 ]; then
    exit 1
fi
exit 0
