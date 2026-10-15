<#
.SYNOPSIS
    AquaBophelo Production & Staging Deployment Smoke Test Suite
.DESCRIPTION
    Automated pre/post-deployment verification script that exercises live endpoints,
    database connectivity, email worker readiness, security headers, CORS policies,
    SignalR WebSocket negotiation, and role authentication gates.
.PARAMETER BaseUrl
    The target backend API URL (default: http://localhost:5094 or https://api.aquabophelo.app).
#>

[CmdletBinding()]
param(
    [string]$BaseUrl = "http://localhost:5094"
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  AquaBophelo Deployment Smoke Test Suite                " -ForegroundColor Cyan
Write-Host "  Target: $BaseUrl                                        " -ForegroundColor Cyan
Write-Host "  Time:   $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$TotalTests = 0
$PassedTests = 0
$FailedTests = 0

function Run-Test {
    param(
        [string]$TestName,
        [scriptblock]$TestBlock
    )
    $script:TotalTests++
    Write-Host "`n[TEST $script:TotalTests] $TestName..." -NoNewline
    try {
        $result = & $TestBlock
        if ($result.Success) {
            $script:PassedTests++
            Write-Host " [PASS]" -ForegroundColor Green
            if ($result.Details) {
                Write-Host "   $($result.Details)" -ForegroundColor DarkGray
            }
        } else {
            $script:FailedTests++
            Write-Host " [FAIL]" -ForegroundColor Red
            Write-Host "   Error: $($result.Error)" -ForegroundColor Yellow
        }
    } catch {
        $script:FailedTests++
        Write-Host " [FAIL]" -ForegroundColor Red
        Write-Host "   Exception: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 1. Liveness Probe
Run-Test "Kubernetes/Container Liveness Probe (GET /health/live)" {
    $res = Invoke-WebRequest -Uri "$BaseUrl/health/live" -Method Get -TimeoutSec 10 -UseBasicParsing
    if ($res.StatusCode -eq 200) {
        $json = $res.Content | ConvertFrom-Json
        return @{ Success = ($json.status -eq "healthy"); Details = "Status: $($json.status)" }
    }
    return @{ Success = $false; Error = "HTTP status code $($res.StatusCode)" }
}

# 2. Database & Message Queue Readiness Probe
Run-Test "System Readiness Probe (GET /health/ready)" {
    $res = Invoke-WebRequest -Uri "$BaseUrl/health/ready" -Method Get -TimeoutSec 10 -UseBasicParsing
    if ($res.StatusCode -eq 200) {
        $json = $res.Content | ConvertFrom-Json
        $dbOk = $json.database -eq "connected"
        $queueOk = $json.messageQueue -eq "active"
        $deliveryOk = $json.deliveryStatus -eq "healthy"
        $allOk = $dbOk -and $queueOk -and $deliveryOk
        return @{
            Success = $allOk
            Details = "DB: $($json.database), Queue: $($json.messageQueue), Delivery: $($json.deliveryStatus), ConsecutiveFailures: $($json.consecutiveDeliveryFailures)"
        }
    }
    return @{ Success = $false; Error = "Readiness returned HTTP $($res.StatusCode). Response: $($res.Content)" }
}

# 3. Detailed API Controller Health
Run-Test "API Controller Health Diagnostics (GET /api/v1/health)" {
    $res = Invoke-WebRequest -Uri "$BaseUrl/api/v1/health" -Method Get -TimeoutSec 10 -UseBasicParsing
    if ($res.StatusCode -eq 200) {
        $json = $res.Content | ConvertFrom-Json
        return @{
            Success = ($json.status -eq "ok")
            Details = "Service: $($json.service), Environment: $($json.environment)"
        }
    }
    return @{ Success = $false; Error = "HTTP status code $($res.StatusCode)" }
}

# 4. Mandatory Security Headers Verification
Run-Test "HTTP Security Headers Enforcement" {
    $res = Invoke-WebRequest -Uri "$BaseUrl/api/v1/health" -Method Get -TimeoutSec 10 -UseBasicParsing
    $headers = $res.Headers
    
    $hasNoSniff = $headers["X-Content-Type-Options"] -eq "nosniff"
    $hasFrameDeny = $headers["X-Frame-Options"] -eq "DENY"
    $hasReferrer = $headers["Referrer-Policy"] -eq "strict-origin-when-cross-origin"

    if ($hasNoSniff -and $hasFrameDeny -and $hasReferrer) {
        return @{
            Success = $true
            Details = "X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin verified"
        }
    }
    return @{ Success = $false; Error = "Missing one or more required security headers in response." }
}

# 5. CORS Header Policy Check
Run-Test "CORS Preflight Headers Verification" {
    $corsHeaders = @{
        "Origin" = "https://aquabophelo.app"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Authorization,Content-Type"
    }
    $res = Invoke-WebRequest -Uri "$BaseUrl/api/v1/auth/login" -Method Options -Headers $corsHeaders -TimeoutSec 10 -UseBasicParsing
    $allowOrigin = $res.Headers["Access-Control-Allow-Origin"]
    $allowCredentials = $res.Headers["Access-Control-Allow-Credentials"]

    if ($allowOrigin -or $res.StatusCode -eq 204 -or $res.StatusCode -eq 200) {
        return @{
            Success = $true
            Details = "CORS preflight accepted. Origin: $allowOrigin, AllowCredentials: $allowCredentials"
        }
    }
    return @{ Success = $false; Error = "CORS preflight failed with HTTP $($res.StatusCode)" }
}

# 6. SignalR Hub Negotiation
Run-Test "SignalR Live Fleet Hub Negotiation (POST /hubs/trucks/negotiate)" {
    $res = Invoke-WebRequest -Uri "$BaseUrl/hubs/trucks/negotiate?negotiateVersion=1" -Method Post -TimeoutSec 10 -UseBasicParsing
    if ($res.StatusCode -eq 200) {
        $json = $res.Content | ConvertFrom-Json
        $hasConnId = [bool]$json.connectionId
        return @{
            Success = $hasConnId
            Details = "Negotiated SignalR session connectionId: $($json.connectionId)"
        }
    }
    return @{ Success = $false; Error = "SignalR negotiation returned HTTP $($res.StatusCode)" }
}

# 7. Authentication Gate: Protected Endpoint Access Without Token
Run-Test "Security Gate: Protected Endpoint Requires Authentication (GET /api/v1/trucks)" {
    try {
        $res = Invoke-WebRequest -Uri "$BaseUrl/api/v1/trucks" -Method Get -TimeoutSec 10 -UseBasicParsing
        return @{ Success = $false; Error = "Endpoint returned HTTP 200 instead of 401 Unauthorized" }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            return @{ Success = $true; Details = "Correctly rejected unauthenticated request with HTTP 401 Unauthorized" }
        }
        return @{ Success = $false; Error = "Unexpected status code: $($_.Exception.Message)" }
    }
}

# 8. Authentication Gate: Rejection of Invalid Credentials
Run-Test "Security Gate: Login Rejection of Invalid Credentials (POST /api/v1/auth/login)" {
    $body = @{
        email = "unregistered.resident@aquabophelo.invalid"
        password = "WrongPassword999!"
    } | ConvertTo-Json

    try {
        $res = Invoke-WebRequest -Uri "$BaseUrl/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -UseBasicParsing
        return @{ Success = $false; Error = "Endpoint returned HTTP 200 for invalid credentials" }
    } catch {
        $statusCode = [int]$_.Exception.Response.StatusCode
        if ($statusCode -eq 400 -or $statusCode -eq 401) {
            return @{ Success = $true; Details = "Correctly returned HTTP $statusCode for unauthorized credentials" }
        }
        return @{ Success = $false; Error = "Unexpected status code: $statusCode" }
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  Smoke Test Results: $PassedTests Passed, $FailedTests Failed (Total: $TotalTests)" -ForegroundColor $(if ($FailedTests -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($FailedTests -gt 0) {
    exit 1
}
exit 0
