#!/bin/bash
# Deploy Security & Monitoring Features
# Run this script from WSL

echo "=========================================="
echo "Security & Monitoring Deployment"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "site.yml" ]; then
    echo "Error: site.yml not found!"
    echo "Please run this script from the ansible directory"
    exit 1
fi

echo "This will deploy:"
echo "  ✓ Firewall (UFW)"
echo "  ✓ Fail2Ban (brute-force protection)"
echo "  ✓ Health monitoring"
echo "  ✓ System resource monitoring"
echo "  ✓ Automated backups"
echo "  ✓ Log management"
echo ""

read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "Running Ansible playbook..."
echo ""

# Run Ansible playbook
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "Deployment Complete!"
    echo "=========================================="
    echo ""
    echo "Security features enabled:"
    echo "  ✓ UFW Firewall"
    echo "  ✓ Fail2Ban"
    echo "  ✓ SSH Hardening"
    echo "  ✓ Automatic security updates"
    echo ""
    echo "Monitoring features enabled:"
    echo "  ✓ Health checks (every 5 minutes)"
    echo "  ✓ System monitoring (every 15 minutes)"
    echo "  ✓ Log monitoring"
    echo "  ✓ Monitoring dashboard"
    echo ""
    echo "Backup features enabled:"
    echo "  ✓ Daily application backup (2:00 AM)"
    echo "  ✓ Daily configuration backup (2:30 AM)"
    echo "  ✓ Weekly full backup (Sunday 3:00 AM)"
    echo ""
    echo "Next steps:"
    echo "1. SSH to server: ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190"
    echo "2. Run monitoring dashboard: monitor"
    echo "3. Check logs: sudo tail -f /var/log/expense-tracker/health-check.log"
    echo ""
    echo "Read SECURITY_MONITORING_GUIDE.md for full documentation"
    echo ""
else
    echo ""
    echo "=========================================="
    echo "Deployment Failed!"
    echo "=========================================="
    echo ""
    echo "Check the error messages above"
    echo ""
    exit 1
fi
