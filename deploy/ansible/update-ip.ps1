# Update IP Address After AWS Instance Restart
# This script helps you update all configuration files with the new IP

param(
    [Parameter(Mandatory=$true)]
    [string]$NewIP
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AWS IP Address Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$OldIP = "15.206.186.213"
$ProjectRoot = "c:\Users\nithi\OneDrive\Desktop\CSE\Expense-Tracker\deploy\ansible"

Write-Host "Old IP: $OldIP" -ForegroundColor Yellow
Write-Host "New IP: $NewIP" -ForegroundColor Green
Write-Host ""

# Validate IP format
if ($NewIP -notmatch '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$') {
    Write-Host "Error: Invalid IP address format" -ForegroundColor Red
    Write-Host "Example: 13.127.45.67" -ForegroundColor Yellow
    exit 1
}

Write-Host "Files to update:" -ForegroundColor Cyan
Write-Host "1. inventory/production.yml" -ForegroundColor White
Write-Host "2. inventory/group_vars/all.yml" -ForegroundColor White
Write-Host "3. inventory/group_vars/all.vault.yml (requires manual edit)" -ForegroundColor White
Write-Host ""

# Confirm
Write-Host "Do you want to proceed? (yes/no): " -ForegroundColor Yellow -NoNewline
$confirm = Read-Host
if ($confirm -ne "yes" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""

# Update production.yml
Write-Host "Updating inventory/production.yml..." -ForegroundColor Yellow
$productionFile = Join-Path $ProjectRoot "inventory\production.yml"
if (Test-Path $productionFile) {
    $content = Get-Content $productionFile -Raw
    $content = $content -replace $OldIP, $NewIP
    Set-Content $productionFile $content
    Write-Host "  Updated!" -ForegroundColor Green
} else {
    Write-Host "  File not found!" -ForegroundColor Red
}

# Update all.yml
Write-Host "Updating inventory/group_vars/all.yml..." -ForegroundColor Yellow
$allFile = Join-Path $ProjectRoot "inventory\group_vars\all.yml"
if (Test-Path $allFile) {
    $content = Get-Content $allFile -Raw
    $content = $content -replace $OldIP, $NewIP
    Set-Content $allFile $content
    Write-Host "  Updated!" -ForegroundColor Green
} else {
    Write-Host "  File not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Manual Step Required" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You must manually update the vault file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "From WSL or Linux, run:" -ForegroundColor White
Write-Host "  cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible" -ForegroundColor Cyan
Write-Host "  ansible-vault edit inventory/group_vars/all.vault.yml" -ForegroundColor Cyan
Write-Host ""
Write-Host "Change these values:" -ForegroundColor White
Write-Host "  VITE_API_URL: http://$OldIP:8000" -ForegroundColor Red
Write-Host "  to" -ForegroundColor Yellow
Write-Host "  VITE_API_URL: http://${NewIP}:8000" -ForegroundColor Green
Write-Host ""
Write-Host "  CLIENT_URL: http://$OldIP" -ForegroundColor Red
Write-Host "  to" -ForegroundColor Yellow
Write-Host "  CLIENT_URL: http://$NewIP" -ForegroundColor Green
Write-Host ""
Write-Host "After updating vault, redeploy:" -ForegroundColor White
Write-Host "  ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Updated Files:" -ForegroundColor Green
Write-Host "  - inventory/production.yml" -ForegroundColor White
Write-Host "  - inventory/group_vars/all.yml" -ForegroundColor White
Write-Host ""
Write-Host "Manual Update Required:" -ForegroundColor Yellow
Write-Host "  - inventory/group_vars/all.vault.yml" -ForegroundColor White
Write-Host ""
Write-Host "New Application URL:" -ForegroundColor Green
Write-Host "  http://${NewIP}:8000" -ForegroundColor Cyan
Write-Host ""
