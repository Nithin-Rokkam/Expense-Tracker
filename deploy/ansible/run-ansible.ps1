# Helper Script to Run Ansible on Windows
# This script opens WSL and provides the correct commands

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ansible on Windows - Helper Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Problem:" -ForegroundColor Yellow
Write-Host "  Ansible doesn't work natively on Windows PowerShell" -ForegroundColor White
Write-Host ""

Write-Host "Solution:" -ForegroundColor Green
Write-Host "  Use WSL (Windows Subsystem for Linux)" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Check WSL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking if WSL is installed..." -ForegroundColor Yellow
try {
    $wslVersion = wsl --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ WSL is installed!" -ForegroundColor Green
        Write-Host ""
    } else {
        throw "WSL not found"
    }
} catch {
    Write-Host "  ✗ WSL is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "To install WSL:" -ForegroundColor Yellow
    Write-Host "  1. Open PowerShell as Administrator" -ForegroundColor White
    Write-Host "  2. Run: wsl --install" -ForegroundColor Cyan
    Write-Host "  3. Restart your computer" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Commands to Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "I'll now open WSL for you." -ForegroundColor Yellow
Write-Host "Copy and paste these commands in WSL:" -ForegroundColor Yellow
Write-Host ""

$commands = @"
# 1. Install Ansible (if not already installed)
sudo apt update && sudo apt install ansible -y

# 2. Navigate to your project
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# 3. Verify you're in the right place
pwd
ls -la inventory/production.yml

# 4. Run Ansible deployment
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
"@

Write-Host $commands -ForegroundColor Cyan
Write-Host ""

# Copy commands to clipboard
Set-Clipboard -Value $commands
Write-Host "✓ Commands copied to clipboard!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Opening WSL in 3 seconds..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Paste the commands (Ctrl+V or Right-click) in WSL" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 3

# Open WSL
wsl
