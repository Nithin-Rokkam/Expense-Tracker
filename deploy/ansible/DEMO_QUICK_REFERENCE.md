# Demo Quick Reference Card

## 🚀 Print This and Keep During Presentation!

---

## SSH Connection
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190
```

---

## Security Commands

### Firewall Status
```bash
sudo ufw status verbose
```

### Fail2Ban Status
```bash
sudo fail2ban-client status sshd
```

### SSH Security
```bash
sudo cat /etc/ssh/sshd_config | grep PermitRootLogin
```

---

## Monitoring Commands

### Dashboard
```bash
monitor
```

### Health Checks
```bash
sudo tail -n 10 /var/log/expense-tracker/health-check.log
```

### System Monitor
```bash
sudo tail -n 10 /var/log/expense-tracker/system-monitor.log
```

### Live Logs
```bash
sudo journalctl -u expense-tracker -n 20 --no-pager
```

---

## Backup Commands

### List Backups
```bash
ls -lh /opt/backups/daily/
```

### Backup Schedule
```bash
crontab -l -u exptracker | grep backup
```

### Backup Logs
```bash
sudo tail -n 10 /var/log/expense-tracker/backup.log
```

---

## Service Management

### Status
```bash
sudo systemctl status expense-tracker
```

### Restart
```bash
sudo systemctl restart expense-tracker
```

### Stop (for demo)
```bash
sudo systemctl stop expense-tracker
```

### Start
```bash
sudo systemctl start expense-tracker
```

---

## Live Demo - Auto Restart

```bash
# 1. Stop service
sudo systemctl stop expense-tracker

# 2. Run health check
sudo /opt/monitoring/scripts/health-check.sh

# 3. Check status (should be running)
sudo systemctl status expense-tracker

# 4. Show log
sudo tail -n 3 /var/log/expense-tracker/health-check.log
```

---

## Key Points to Mention

### Security
- ✅ UFW Firewall (only 4 ports open)
- ✅ Fail2Ban (5 attempts = 1 hour ban)
- ✅ No root login
- ✅ Auto security updates

### Monitoring
- ✅ Health checks every 5 min
- ✅ System monitor every 15 min
- ✅ Auto-restart on failure
- ✅ Detailed logging

### Backups
- ✅ Daily at 2:00 AM (7 days)
- ✅ Weekly on Sunday (4 weeks)
- ✅ Automatic compression
- ✅ Easy restore

### Ansible
- ✅ Infrastructure as code
- ✅ Reproducible deployments
- ✅ Role-based organization
- ✅ Encrypted secrets (Vault)

---

## Common Viva Questions

**Q: How do you protect against brute-force?**
A: Fail2Ban - 5 attempts = 1 hour ban

**Q: What ports are open?**
A: Only 22, 80, 443, 8000

**Q: How do you know if app goes down?**
A: Health checks every 5 min + auto-restart

**Q: Backup strategy?**
A: Daily (7 days) + Weekly (4 weeks)

**Q: Why Ansible?**
A: Infrastructure as code, reproducible, version-controlled

---

## Emergency Commands

### If something breaks
```bash
# Restart everything
sudo systemctl restart expense-tracker

# Check logs
sudo journalctl -u expense-tracker -n 50

# Check if port is in use
sudo netstat -tulpn | grep 8000
```

---

## Application URL
```
http://3.110.163.190:8000
```

---

**Keep calm and demo on!** 🎯
