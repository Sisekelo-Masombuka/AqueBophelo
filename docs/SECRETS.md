# AquaBophelo — Production Secrets Management & Key Vault Runbook

This document details the configuration, injection, and rotation runbook for secrets and sensitive credentials across the **AquaBophelo Municipal Water Management System** (Sol Plaatje Local Municipality).

---

## 1. Principles of Secrets Management

1. **Zero Plaintext Secrets in Source Code:** No connection strings, passwords, JWT signing keys, or third-party API keys may be committed to version control.
2. **Managed Identity / Key Vault First:** In cloud environments (Azure / AWS), use Managed Identity or Azure Key Vault references rather than hardcoding credentials into deployment pipelines.
3. **Environment Separation:** Local development uses dynamic generation (`Guid`-based admin password fallback) or local `.env` files (excluded by `.gitignore`). Staging and Production utilize dedicated secret stores with strict role-based access control (RBAC).
4. **Regular Rotation:** Production credentials follow defined rotation cycles, with immediate rotation upon any suspicion of compromise.

---

## 2. Secrets Inventory & Specification Matrix

| Configuration Key | Subsystem | Min Entropy / Type | Production Source | Rotation Frequency |
| :--- | :--- | :--- | :--- | :--- |
| `ConnectionStrings__DefaultConnection` | Database (Azure SQL / MSSQL) | Encrypted connection string with TLS (`Encrypt=True`) | Azure Key Vault / App Service | 90–180 days |
| `Jwt__Key` | JWT Authentication | 64+ bytes (512-bit HMAC-SHA256) | Azure Key Vault (`@Microsoft.KeyVault(...)`) | 90 days |
| `ADMIN_INITIAL_PASSWORD` | Identity Seeding | 16+ chars (Mixed case, numbers, symbols) | One-time bootstrap via Key Vault | Immediate after initial login |
| `Brevo__ApiKey` | Transactional Email / OTP | 64+ chars (`xkeysib-...`) | Azure Key Vault | 90 days |
| `R2__AccountId` | Cloudflare R2 Cloud Storage | 32-character hex ID | App Service Config / Key Vault | Static |
| `R2__AccessKeyId` | Cloudflare S3 Access Token | 32-character hex key | Azure Key Vault | 180 days |
| `R2__SecretAccessKey` | Cloudflare S3 Secret | 64-character hex key | Azure Key Vault | 180 days |
| `Turnstile__SecretKey` | Bot Defense | Format: `0x4AAAAAA...` | Azure Key Vault | On compromise |
| `Sentry__Dsn` | APM & Crash Monitoring | HTTPS DSN | App Service Config | Static |

---

## 3. Azure Key Vault & App Service Integration

### Setting Up Azure Key Vault with Managed Identity
To securely inject secrets into Azure App Service without exposing them in CI/CD pipeline logs:

1. **Create the Key Vault:**
   ```bash
   az keyvault create \
     --name "kv-aquabophelo-prod" \
     --resource-group "rg-aquabophelo" \
     --location "southafricanorth" \
     --enable-rbac-authorization true
   ```

2. **Enable System-Assigned Managed Identity on App Service:**
   ```bash
   az webapp identity assign \
     --name "aquabophelo-api" \
     --resource-group "rg-aquabophelo"
   ```

3. **Grant "Key Vault Secrets User" Role to the App Service:**
   ```bash
   APP_PRINCIPAL_ID=$(az webapp identity show --name "aquabophelo-api" --resource-group "rg-aquabophelo" --query principalId -o tsv)
   KV_SCOPE=$(az keyvault show --name "kv-aquabophelo-prod" --query id -o tsv)

   az role assignment create \
     --assignee "$APP_PRINCIPAL_ID" \
     --role "Key Vault Secrets User" \
     --scope "$KV_SCOPE"
   ```

4. **Reference Key Vault Secrets in App Service Configuration:**
   In Azure Portal -> App Service -> **Configuration** -> **Application settings**, set values using the Key Vault syntax:
   ```text
   Jwt__Key = @Microsoft.KeyVault(VaultName=kv-aquabophelo-prod;SecretName=JwtKey)
   ConnectionStrings__DefaultConnection = @Microsoft.KeyVault(VaultName=kv-aquabophelo-prod;SecretName=SqlConnectionString)
   Brevo__ApiKey = @Microsoft.KeyVault(VaultName=kv-aquabophelo-prod;SecretName=BrevoApiKey)
   Turnstile__SecretKey = @Microsoft.KeyVault(VaultName=kv-aquabophelo-prod;SecretName=TurnstileSecretKey)
   ```

---

## 4. Secret Generation Runbook

### Generating High-Entropy JWT Keys
To generate a secure 64-byte Base64 key for `Jwt__Key`:
```bash
# Linux / macOS / WSL
openssl rand -base64 48

# Windows PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Generating SQL Server SA / Admin Passwords
```bash
# 24-character random password with symbols
openssl rand -base64 18 | tr -dc 'A-Za-z0-9!#$' | head -c 24
```

---

## 5. Secret Rotation Procedures

### A. Rotating the JWT Signing Key
1. Generate a new 64-character signing key.
2. In Azure Key Vault, create a new version of `JwtKey`.
3. Restart the App Service to load the new key.
4. Existing client JWTs will expire within their validity period (default 120 minutes), after which users re-authenticate.

### B. Rotating Brevo Email API Key
1. In Brevo Dashboard -> **SMTP & API Keys** -> Click **Generate a new API key**.
2. Name the key `aquabophelo-prod-YYYY-MM`.
3. Store the new key in Key Vault (`BrevoApiKey`).
4. Test email dispatch via `/api/v1/auth/send-otp`.
5. Revoke the old key in the Brevo console.

---

## 6. Verification & Audit Checks

Before every production release, run these automated verification checks:
```bash
# 1. Scan codebase for accidental plaintext credentials
git grep -i -E "(password|secret|apikey|bearer)[[:space:]]*[:=][[:space:]]*['\"][a-zA-Z0-9_\-!#]{8,}['\"]" -- ':!*.test.*' ':!*.example'

# 2. Confirm no .env files are staged
git status --ignored
```
