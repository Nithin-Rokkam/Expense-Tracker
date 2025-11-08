# Fix Login Issue - Run commands on server
$KEY_PATH = "$env:USERPROFILE\.ssh\MyKeyPair.pem"
$SERVER = "ubuntu@52.66.246.144"

Write-Host "Fixing Login Issue on Server" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $KEY_PATH)) {
    Write-Host "Error: SSH key not found at $KEY_PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Using SSH key: $KEY_PATH" -ForegroundColor Green
Write-Host "Connecting to: $SERVER" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Creating .env.production file..." -ForegroundColor Yellow
& ssh -i $KEY_PATH $SERVER "cd /opt/expense-tracker/client/expense-tracker && echo 'VITE_API_URL=http://52.66.246.144:8000' | sudo tee .env.production"

Write-Host "`nStep 2: Verifying .env.production..." -ForegroundColor Yellow
& ssh -i $KEY_PATH $SERVER "cat /opt/expense-tracker/client/expense-tracker/.env.production"

Write-Host "`nStep 3: Fixing permissions..." -ForegroundColor Yellow
& ssh -i $KEY_PATH $SERVER "sudo chown -R exptracker:exptracker /opt/expense-tracker"

Write-Host "`nStep 4: Rebuilding frontend (this will take a few minutes)..." -ForegroundColor Yellow
& ssh -i $KEY_PATH $SERVER "sudo -u exptracker bash -c 'cd /opt/expense-tracker/client/expense-tracker && npm run build'"

Write-Host "`nStep 5: Restarting backend service..." -ForegroundColor Yellow
& ssh -i $KEY_PATH $SERVER "sudo systemctl restart expense-tracker"

Write-Host "`nStep 6: Checking service status..." -ForegroundColor Yellow
& ssh -i $KEY_PATH $SERVER "sudo systemctl status expense-tracker --no-pager -l"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Fix completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open http://52.66.246.144:8000 in your browser" -ForegroundColor White
    Write-Host "2. Try to login/signup" -ForegroundColor White
    Write-Host "3. It should work now!" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Error: Fix script failed" -ForegroundColor Red
    Write-Host "Check the output above for errors" -ForegroundColor Red
}
