# Security & Monitoring Guide

## 🔒 Security Features

Your Expense Tracker application now includes comprehensive security measures:

### **1. UFW Firewall**

**What it does:**
- Blocks all incoming traffic by default
- Allows only necessary ports (SSH, HTTP, HTTPS, Backend)
- Protects against unauthorized access

**Allowed Ports:**
- `22` - SSH access
- `80` - HTTP
- `443` - HTTPS (when SSL enabled)
- `8000` - Backend API

**Check firewall status:**
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190
sudo ufw status verbose
```

**View firewall logs:**
```bash
sudo tail -f /var/log/ufw.log
```

---

### **2. Fail2Ban**

**What it does:**
- Monitors login attempts
- Automatically bans IPs after failed attempts
- Protects against brute-force attacks

**Configuration:**
- Max retries: 5 attempts
- Ban time: 1 hour
- Find time: 10 minutes

**Check Fail2Ban status:**
```bash
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

**View banned IPs:**
```bash
sudo fail2ban-client status sshd
```

**Unban an IP:**
```bash
sudo fail2ban-client set sshd unbanip <IP_ADDRESS>
```

---

### **3. SSH Hardening**

**Security measures:**
- Root login disabled
- Password authentication can be disabled (keys only)
- Secure SSH configuration

**Current settings:**
```bash
# View SSH config
sudo cat /etc/ssh/sshd_config | grep -E "PermitRootLogin|PasswordAuthentication"
```

---

### **4. Automatic Security Updates**

**What it does:**
- Automatically installs security patches
- Keeps system up-to-date
- Reduces vulnerability window

**Check update status:**
```bash
sudo unattended-upgrades --dry-run
sudo cat /var/log/unattended-upgrades/unattended-upgrades.log
```

---

## 📊 Monitoring Features

### **1. Health Checks**

**What it monitors:**
- Service status (is expense-tracker running?)
- HTTP endpoint (is app responding?)
- Automatic restart on failure

**Schedule:** Every 5 minutes

**View health check logs:**
```bash
sudo tail -f /var/log/expense-tracker/health-check.log
```

**Manual health check:**
```bash
sudo /opt/monitoring/scripts/health-check.sh
```

---

### **2. System Resource Monitoring**

**What it tracks:**
- CPU usage
- Memory usage
- Disk usage
- Alerts when thresholds exceeded (>80%)

**Schedule:** Every 15 minutes

**View system monitor logs:**
```bash
sudo tail -f /var/log/expense-tracker/system-monitor.log
```

**Manual system check:**
```bash
sudo /opt/monitoring/scripts/system-monitor.sh
```

---

### **3. Application Log Monitoring**

**What it does:**
- Scans application logs for errors
- Counts error frequency
- Logs error patterns

**Schedule:** Every 5 minutes

**View log monitor output:**
```bash
sudo tail -f /var/log/expense-tracker/log-monitor.log
```

**View application logs:**
```bash
sudo journalctl -u expense-tracker -f
```

---

### **4. Monitoring Dashboard**

**Quick overview of everything:**
```bash
# SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190

# Run dashboard
monitor
```

**Dashboard shows:**
- Service status
- System resources (CPU, Memory, Disk)
- Recent errors
- Last health check
- System uptime

---

## 💾 Backup System

### **1. Automated Backups**

**Backup Schedule:**

| Type | Schedule | Retention | Location |
|------|----------|-----------|----------|
| **Application** | Daily 2:00 AM | 7 days | `/opt/backups/daily/` |
| **Configuration** | Daily 2:30 AM | 7 days | `/opt/backups/daily/` |
| **Full Backup** | Sunday 3:00 AM | 4 weeks | `/opt/backups/weekly/` |

**What's backed up:**
- Application code
- Configuration files
- Environment variables
- Service files

**What's excluded:**
- `node_modules` (can be reinstalled)
- `.git` (in repository)
- Log files (rotated separately)

---

### **2. Manual Backups**

**Backup application:**
```bash
sudo /opt/backups/scripts/backup-app.sh
```

**Backup configuration:**
```bash
sudo /opt/backups/scripts/backup-config.sh
```

**Full backup:**
```bash
sudo /opt/backups/scripts/backup-weekly.sh
```

---

### **3. View Backups**

**List all backups:**
```bash
# Daily backups
ls -lh /opt/backups/daily/

# Weekly backups
ls -lh /opt/backups/weekly/
```

**Check backup size:**
```bash
du -sh /opt/backups/
```

**View backup logs:**
```bash
sudo tail -f /var/log/expense-tracker/backup.log
```

---

### **4. Restore from Backup**

**List available backups:**
```bash
sudo /opt/backups/scripts/restore.sh
```

**Restore specific backup:**
```bash
sudo /opt/backups/scripts/restore.sh /opt/backups/daily/expense-tracker-app-20250109_020000.tar.gz
```

**⚠️ Warning:** Restore will overwrite current files!

---

## 📝 Log Management

### **Log Locations**

| Log Type | Location |
|----------|----------|
| **Application** | `/var/log/expense-tracker/` |
| **Health Checks** | `/var/log/expense-tracker/health-check.log` |
| **System Monitor** | `/var/log/expense-tracker/system-monitor.log` |
| **Backups** | `/var/log/expense-tracker/backup.log` |
| **Service** | `journalctl -u expense-tracker` |
| **Firewall** | `/var/log/ufw.log` |
| **Fail2Ban** | `/var/log/fail2ban.log` |

### **Log Rotation**

**Configuration:**
- Rotation: Daily
- Retention: 14 days
- Compression: Enabled

**View log rotation config:**
```bash
cat /etc/logrotate.d/expense-tracker
```

---

## 🚀 Deployment with Security & Monitoring

### **First Time Setup**

```bash
# From WSL
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# Run full deployment
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

This will:
1. ✅ Deploy application
2. ✅ Configure firewall
3. ✅ Set up Fail2Ban
4. ✅ Enable monitoring
5. ✅ Configure backups

---

### **Update Only Security**

```bash
ansible-playbook -i inventory/production.yml site.yml --tags security --ask-vault-pass
```

### **Update Only Monitoring**

```bash
ansible-playbook -i inventory/production.yml site.yml --tags monitoring --ask-vault-pass
```

### **Update Only Backups**

```bash
ansible-playbook -i inventory/production.yml site.yml --tags backup --ask-vault-pass
```

---

## 🔧 Configuration Options

### **Security Settings**

Edit `inventory/group_vars/all.yml`:

```yaml
# Security Configuration
allow_backend_port: true          # Allow external access to backend port
reset_firewall: false             # Set to true to reset UFW on first run
disable_password_auth: false      # Set to true to disable SSH password auth
```

### **Monitoring Settings**

```yaml
# Monitoring Configuration
health_check_interval: 5          # Minutes between health checks
system_monitor_interval: 15       # Minutes between system resource checks
log_retention_days: 14            # Days to keep logs
```

### **Backup Settings**

```yaml
# Backup Configuration
backup_retention_days: 7          # Days to keep daily backups
backup_retention_weeks: 4         # Weeks to keep weekly backups
```

---

## 📊 Monitoring Commands Cheat Sheet

```bash
# SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190

# View monitoring dashboard
monitor

# Check service status
sudo systemctl status expense-tracker

# View live application logs
sudo journalctl -u expense-tracker -f

# View health check logs
sudo tail -f /var/log/expense-tracker/health-check.log

# View system monitor logs
sudo tail -f /var/log/expense-tracker/system-monitor.log

# Check firewall status
sudo ufw status verbose

# Check Fail2Ban status
sudo fail2ban-client status

# List backups
ls -lh /opt/backups/daily/

# View backup logs
sudo tail -f /var/log/expense-tracker/backup.log

# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

---

## 🆘 Troubleshooting

### **Service Won't Start**

```bash
# Check service status
sudo systemctl status expense-tracker

# View recent logs
sudo journalctl -u expense-tracker -n 50

# Check if port is in use
sudo netstat -tulpn | grep 8000

# Restart service
sudo systemctl restart expense-tracker
```

### **High Resource Usage**

```bash
# Check what's using CPU
top

# Check what's using memory
free -h

# Check disk usage
df -h

# Check large files
sudo du -sh /opt/expense-tracker/*
```

### **Firewall Blocking Access**

```bash
# Check firewall rules
sudo ufw status numbered

# Allow specific port
sudo ufw allow 8000/tcp

# Reload firewall
sudo ufw reload
```

### **Backup Failed**

```bash
# Check backup logs
sudo tail -n 50 /var/log/expense-tracker/backup.log

# Check disk space
df -h /opt/backups

# Run manual backup
sudo /opt/backups/scripts/backup-app.sh
```

---

## ✅ Security Checklist

After deployment, verify:

- [ ] Firewall is enabled: `sudo ufw status`
- [ ] Fail2Ban is running: `sudo systemctl status fail2ban`
- [ ] Health checks are working: `sudo tail /var/log/expense-tracker/health-check.log`
- [ ] Backups are created: `ls /opt/backups/daily/`
- [ ] Monitoring dashboard works: `monitor`
- [ ] Application is accessible: `http://3.110.163.190:8000`
- [ ] Logs are being written: `ls -l /var/log/expense-tracker/`

---

## 📚 Additional Resources

- **Main README:** `README.md`
- **Instance Restart Guide:** `INSTANCE_RESTART_GUIDE.md`
- **Ansible Deployment:** `ANSIBLE_DEPLOYMENT_EXPLAINED.md`
- **Step-by-Step Guide:** `STEP_BY_STEP_GUIDE.md`

---

**Last Updated:** November 9, 2025  
**Current IP:** 3.110.163.190  
**Status:** ✅ Security & Monitoring Enabled
