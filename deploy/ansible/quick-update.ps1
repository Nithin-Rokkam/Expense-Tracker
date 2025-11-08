# Quick IP Update Script
# Usage: .\quick-update.ps1 -NewIP "65.2.123.158"

param(
    [Parameter(Mandatory=$true)]
    [string]$NewIP
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick IP Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Validate IP format
if ($NewIP -notmatch '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$') {
    Write-Host "Error: Invalid IP address format" -ForegroundColor Red
    Write-Host "Example: 65.2.123.158" -ForegroundColor Yellow
    exit 1
}

Write-Host "New IP Address: $NewIP" -ForegroundColor Green
Write-Host ""

$ProjectRoot = "c:\Users\nithi\OneDrive\Desktop\CSE\Expense-Tracker\deploy\ansible"

# Update production.yml
Write-Host "Updating production.yml..." -ForegroundColor Yellow
$prodFile = Join-Path $ProjectRoot "inventory\production.yml"
if (Test-Path $prodFile) {
    $content = Get-Content $prodFile -Raw
    $content = $content -replace 'ansible_host: [\d.]+', "ansible_host: $NewIP"
    Set-Content $prodFile $content
    Write-Host "  ✓ Updated!" -ForegroundColor Green
} else {
    Write-Host "  ✗ File not found!" -ForegroundColor Red
}

# Update all.yml
Write-Host "Updating all.yml..." -ForegroundColor Yellow
$allFile = Join-Path $ProjectRoot "inventory\group_vars\all.yml"
if (Test-Path $allFile) {
    $content = Get-Content $allFile -Raw
    $content = $content -replace 'public_domain: [\d.]+', "public_domain: $NewIP"
    Set-Content $allFile $content
    Write-Host "  ✓ Updated!" -ForegroundColor Green
} else {
    Write-Host "  ✗ File not found!" -ForegroundColor Red
}

# Update fix-on-server.ps1
Write-Host "Updating fix-on-server.ps1..." -ForegroundColor Yellow
$fixFile = Join-Path $ProjectRoot "fix-on-server.ps1"
if (Test-Path $fixFile) {
    $content = Get-Content $fixFile -Raw
    $content = $content -replace '\$SERVER = "ubuntu@[\d.]+"', "`$SERVER = `"ubuntu@$NewIP`""
    $content = $content -replace 'VITE_API_URL=http://[\d.]+:8000', "VITE_API_URL=http://${NewIP}:8000"
    $content = $content -replace 'http://[\d.]+:8000 in your browser', "http://${NewIP}:8000 in your browser"
    Set-Content $fixFile $content
    Write-Host "  ✓ Updated!" -ForegroundColor Green
} else {
    Write-Host "  ✗ File not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Local Files Updated!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Files updated:" -ForegroundColor Cyan
Write-Host "  ✓ inventory/production.yml" -ForegroundColor White
Write-Host "  ✓ inventory/group_vars/all.yml" -ForegroundColor White
Write-Host "  ✓ fix-on-server.ps1" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Next Steps" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "OPTION 1: Use fix-on-server.ps1 (Easiest)" -ForegroundColor Cyan
Write-Host "  .\fix-on-server.ps1" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2: Manual SSH Commands" -ForegroundColor Cyan
Write-Host "  ssh -i ~/.ssh/MyKeyPair.pem ubuntu@$NewIP" -ForegroundColor White
Write-Host "  cd /opt/expense-tracker/client/expense-tracker" -ForegroundColor White
Write-Host "  echo 'VITE_API_URL=http://${NewIP}:8000' | sudo tee .env.production" -ForegroundColor White
Write-Host "  sudo chown -R exptracker:exptracker /opt/expense-tracker" -ForegroundColor White
Write-Host "  sudo -u exptracker npm run build" -ForegroundColor White
Write-Host "  sudo systemctl restart expense-tracker" -ForegroundColor White
Write-Host ""

Write-Host "After updating server, test at:" -ForegroundColor Cyan
Write-Host "  http://${NewIP}:8000" -ForegroundColor Green
Write-Host ""

# Copy commands to clipboard
$commands = @"
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@$NewIP
cd /opt/expense-tracker/client/expense-tracker
echo 'VITE_API_URL=http://${NewIP}:8000' | sudo tee .env.production
sudo chown -R exptracker:exptracker /opt/expense-tracker
sudo -u exptracker npm run build
sudo systemctl restart expense-tracker
sudo systemctl status expense-tracker
exit
"@

Set-Clipboard -Value $commands
Write-Host "✓ Server commands copied to clipboard!" -ForegroundColor Green
Write-Host "  Paste them in your SSH session" -ForegroundColor Gray
Write-Host ""
