# Presentation & Viva Demo Guide

## 🎓 How to Demonstrate Security & Monitoring Features

This guide will help you showcase your application's security and monitoring capabilities during your presentation and viva.

---

## 📋 Pre-Presentation Checklist

### **Before Your Presentation**

```bash
# 1. Ensure application is running
curl http://3.110.163.190:8000/

# 2. SSH to server and verify everything
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190

# 3. Check all services are active
sudo systemctl status expense-tracker
sudo ufw status
sudo fail2ban-client status

# 4. Verify logs exist
ls -l /var/log/expense-tracker/

# 5. Check backups exist
ls -l /opt/backups/daily/
```

---

## 🎯 Demo Scenarios for Presentation

### **Scenario 1: Show Security Features (5 minutes)**

#### **1.1 Demonstrate Firewall Protection**

```bash
# SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190

# Show firewall status
sudo ufw status verbose
```

**What to say:**
> "Our application is protected by UFW firewall. As you can see, we only allow necessary ports: SSH (22), HTTP (80), HTTPS (443), and our backend API (8000). All other ports are blocked by default, protecting against unauthorized access."

**Expected Output:**
```
Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
8000/tcp                   ALLOW       Anywhere
```

---

#### **1.2 Demonstrate Fail2Ban (Brute-Force Protection)**

```bash
# Check Fail2Ban status
sudo fail2ban-client status sshd
```

**What to say:**
> "We've implemented Fail2Ban to protect against brute-force attacks. It monitors login attempts and automatically bans IPs after 5 failed attempts for 1 hour. This protects our server from automated attacks."

**Expected Output:**
```
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     0
|  `- File list:        /var/log/auth.log
`- Actions
   |- Currently banned: 0
   |- Total banned:     0
   `- Banned IP list:
```

---

#### **1.3 Show SSH Hardening**

```bash
# Show SSH security configuration
sudo cat /etc/ssh/sshd_config | grep -E "PermitRootLogin|PasswordAuthentication"
```

**What to say:**
> "We've hardened SSH access by disabling root login. This ensures that even if someone knows the root password, they cannot login directly as root, adding an extra layer of security."

**Expected Output:**
```
PermitRootLogin no
```

---

### **Scenario 2: Show Monitoring Features (5 minutes)**

#### **2.1 Demonstrate Monitoring Dashboard**

```bash
# Run monitoring dashboard
monitor
```

**What to say:**
> "We have a comprehensive monitoring dashboard that shows real-time status of our application. It displays service status, system resources like CPU and memory usage, recent errors, and system uptime."

**Expected Output:**
```
==================================
Expense Tracker Monitoring Dashboard
==================================

Service Status:
● expense-tracker.service - Expense Tracker Backend
   Loaded: loaded
   Active: active (running)

System Resources:
  CPU: 5.2%
  Memory: 450M / 1.9G
  Disk: 35% used

Recent Errors (last hour):
  Error count: 0

Last Health Check:
  [2025-11-09 13:00:00] INFO: Health check passed

System Uptime:
 13:45:23 up 2 days, 4:32, 1 user
```

---

#### **2.2 Show Health Check Logs**

```bash
# View recent health checks
sudo tail -n 20 /var/log/expense-tracker/health-check.log
```

**What to say:**
> "Our system performs automated health checks every 5 minutes. It verifies that the service is running and the HTTP endpoint is responding. If any check fails, it automatically restarts the service."

**Expected Output:**
```
[2025-11-09 13:00:00] INFO: Health check passed
[2025-11-09 13:05:00] INFO: Health check passed
[2025-11-09 13:10:00] INFO: Health check passed
```

---

#### **2.3 Show System Resource Monitoring**

```bash
# View system monitoring logs
sudo tail -n 10 /var/log/expense-tracker/system-monitor.log
```

**What to say:**
> "We continuously monitor system resources - CPU, memory, and disk usage. The system logs these metrics every 15 minutes and alerts us if any resource exceeds 80% usage."

**Expected Output:**
```
[2025-11-09 13:00:00] CPU: 5.2% | Memory: 23.68% | Disk: 35%
[2025-11-09 13:15:00] CPU: 4.8% | Memory: 24.12% | Disk: 35%
```

---

#### **2.4 Show Live Application Logs**

```bash
# View live application logs
sudo journalctl -u expense-tracker -n 20 --no-pager
```

**What to say:**
> "We can view real-time application logs to debug issues or monitor activity. This shows all application events, requests, and any errors that occur."

---

### **Scenario 3: Show Backup System (3 minutes)**

#### **3.1 Show Backup Schedule**

```bash
# Show backup cron jobs
crontab -l -u exptracker | grep backup
```

**What to say:**
> "We have automated backups running daily. Application backups run at 2 AM, configuration backups at 2:30 AM, and full system backups every Sunday at 3 AM."

**Expected Output:**
```
0 2 * * * /opt/backups/scripts/backup-app.sh
30 2 * * * /opt/backups/scripts/backup-config.sh
0 3 * * 0 /opt/backups/scripts/backup-weekly.sh
```

---

#### **3.2 Show Existing Backups**

```bash
# List daily backups
ls -lh /opt/backups/daily/

# List weekly backups
ls -lh /opt/backups/weekly/
```

**What to say:**
> "Here are our automated backups. Daily backups are retained for 7 days, and weekly backups for 4 weeks. Each backup is compressed to save disk space."

**Expected Output:**
```
-rw-r--r-- 1 exptracker exptracker 15M Nov  9 02:00 expense-tracker-app-20251109_020000.tar.gz
-rw-r--r-- 1 exptracker exptracker 14M Nov  8 02:00 expense-tracker-app-20251108_020000.tar.gz
```

---

#### **3.3 Show Backup Logs**

```bash
# View backup logs
sudo tail -n 15 /var/log/expense-tracker/backup.log
```

**What to say:**
> "All backup operations are logged. We can see when backups were created, their size, and if any issues occurred."

---

### **Scenario 4: Live Demo - Make a Change (5 minutes)**

#### **4.1 Demonstrate Configuration Change**

**What to do:**
```bash
# 1. Show current configuration
cat /opt/expense-tracker/client/expense-tracker/.env.production

# 2. Make a small change (e.g., add a comment or change a value)
echo "# Updated during presentation" | sudo tee -a /opt/expense-tracker/client/expense-tracker/.env.production

# 3. Rebuild frontend
cd /opt/expense-tracker/client/expense-tracker
sudo -u exptracker npm run build

# 4. Restart service
sudo systemctl restart expense-tracker

# 5. Verify service restarted
sudo systemctl status expense-tracker
```

**What to say:**
> "Let me demonstrate how we can make configuration changes. I'll update the environment file, rebuild the frontend, and restart the service. The monitoring system will detect the restart and log it."

---

#### **4.2 Demonstrate Auto-Restart on Failure**

**What to do:**
```bash
# 1. Manually stop the service
sudo systemctl stop expense-tracker

# 2. Show it's stopped
sudo systemctl status expense-tracker

# 3. Wait for health check (or run manually)
sudo /opt/monitoring/scripts/health-check.sh

# 4. Show it's automatically restarted
sudo systemctl status expense-tracker

# 5. Show the log entry
sudo tail -n 5 /var/log/expense-tracker/health-check.log
```

**What to say:**
> "Our monitoring system includes self-healing capabilities. If the service stops for any reason, the health check detects it within 5 minutes and automatically restarts the service. Let me demonstrate this."

---

### **Scenario 5: Show Ansible Deployment (3 minutes)**

#### **5.1 Show Ansible Configuration**

```bash
# From your local machine (WSL)
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# Show inventory
cat inventory/production.yml

# Show roles
ls -l roles/
```

**What to say:**
> "We use Ansible for infrastructure as code. Our deployment is organized into roles: common setup, backend, frontend, security, monitoring, and backups. This makes our infrastructure reproducible and version-controlled."

---

#### **5.2 Show Deployment Process**

```bash
# Show what would be deployed (dry run)
ansible-playbook -i inventory/production.yml site.yml --check --ask-vault-pass
```

**What to say:**
> "With a single command, we can deploy the entire application stack including security and monitoring. Ansible ensures idempotency - we can run it multiple times safely."

---

## 🎤 Viva Questions & Answers

### **Security Questions**

**Q: How do you protect against brute-force attacks?**
> A: "We use Fail2Ban which monitors authentication logs. After 5 failed login attempts, it automatically bans the IP address for 1 hour. This prevents automated brute-force attacks."

**Q: What ports are open on your server?**
> A: "We only allow 4 ports: SSH (22) for server access, HTTP (80) and HTTPS (443) for web traffic, and port 8000 for our backend API. All other ports are blocked by the UFW firewall."

**Q: How do you handle security updates?**
> A: "We've configured unattended-upgrades to automatically install security patches. This keeps our system up-to-date without manual intervention, reducing the vulnerability window."

**Q: What if someone gets your SSH key?**
> A: "We've disabled root login, so even with a key, they can't login as root. We also have Fail2Ban monitoring for suspicious activity. Additionally, we can rotate keys using Ansible."

---

### **Monitoring Questions**

**Q: How do you know if your application goes down?**
> A: "We have automated health checks running every 5 minutes. They verify the service is running and the HTTP endpoint is responding. If either check fails, the system automatically restarts the service and logs the event."

**Q: What metrics do you monitor?**
> A: "We monitor three key areas: service health (is it running?), system resources (CPU, memory, disk usage), and application logs (errors and warnings). All metrics are logged for historical analysis."

**Q: How do you handle high resource usage?**
> A: "Our system monitoring checks resources every 15 minutes and logs warnings when CPU, memory, or disk usage exceeds 80%. This gives us early warning to scale resources or optimize the application."

**Q: Can you show me real-time logs?**
> A: "Yes, we can view live logs using `journalctl -u expense-tracker -f`. This shows all application events in real-time, which is useful for debugging and monitoring user activity."

---

### **Backup Questions**

**Q: What's your backup strategy?**
> A: "We have a three-tier backup strategy: daily application backups at 2 AM (7-day retention), daily configuration backups at 2:30 AM (7-day retention), and weekly full backups every Sunday at 3 AM (4-week retention)."

**Q: How do you restore from backup?**
> A: "We have a restore script at `/opt/backups/scripts/restore.sh`. You specify the backup file, and it stops the service, extracts the backup, and restarts the service. The entire process is logged."

**Q: What if the backup fails?**
> A: "All backup operations are logged to `/var/log/expense-tracker/backup.log`. We can monitor this log to detect failures. The backup scripts also return error codes that can trigger alerts."

**Q: Do you backup the database?**
> A: "We're using MongoDB Atlas which has built-in automated backups. For local MongoDB, we would use mongodump in our backup scripts."

---

### **Ansible Questions**

**Q: Why use Ansible instead of manual deployment?**
> A: "Ansible provides infrastructure as code, making our deployment reproducible, version-controlled, and documented. It ensures consistency across environments and reduces human error. We can deploy the entire stack with one command."

**Q: What are Ansible roles?**
> A: "Roles are reusable units of automation. We have roles for common setup, backend, frontend, security, monitoring, and backups. Each role is independent and can be updated separately."

**Q: How do you handle secrets in Ansible?**
> A: "We use Ansible Vault to encrypt sensitive data like database credentials and API keys. The vault file is encrypted with a password, and only authorized users can decrypt it during deployment."

**Q: Can you deploy to multiple servers?**
> A: "Yes, we just add more hosts to our inventory file. Ansible will deploy to all servers in parallel. This makes scaling easy."

---

## 🎬 Demo Script (Complete Flow - 15 minutes)

### **Introduction (1 minute)**
> "Our Expense Tracker application is deployed on AWS EC2 with comprehensive security and monitoring. Let me demonstrate the key features."

### **Part 1: Security (4 minutes)**
```bash
# 1. Show firewall
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190
sudo ufw status verbose

# 2. Show Fail2Ban
sudo fail2ban-client status sshd

# 3. Show SSH hardening
sudo cat /etc/ssh/sshd_config | grep PermitRootLogin
```

### **Part 2: Monitoring (5 minutes)**
```bash
# 1. Show dashboard
monitor

# 2. Show health checks
sudo tail -n 10 /var/log/expense-tracker/health-check.log

# 3. Show system monitoring
sudo tail -n 5 /var/log/expense-tracker/system-monitor.log

# 4. Show live logs
sudo journalctl -u expense-tracker -n 10 --no-pager
```

### **Part 3: Backups (3 minutes)**
```bash
# 1. Show backup schedule
crontab -l -u exptracker | grep backup

# 2. Show existing backups
ls -lh /opt/backups/daily/

# 3. Show backup logs
sudo tail -n 10 /var/log/expense-tracker/backup.log
```

### **Part 4: Live Demo (5 minutes)**
```bash
# Demonstrate auto-restart
sudo systemctl stop expense-tracker
sudo /opt/monitoring/scripts/health-check.sh
sudo systemctl status expense-tracker
sudo tail -n 3 /var/log/expense-tracker/health-check.log
```

### **Conclusion (2 minutes)**
> "As demonstrated, our application has enterprise-grade security with firewall and brute-force protection, proactive monitoring with auto-healing, and automated backups. All managed through Ansible for reproducible deployments."

---

## 📝 Quick Command Cheat Sheet for Demo

```bash
# Security
sudo ufw status verbose
sudo fail2ban-client status sshd
sudo cat /etc/ssh/sshd_config | grep PermitRootLogin

# Monitoring
monitor
sudo tail -f /var/log/expense-tracker/health-check.log
sudo journalctl -u expense-tracker -n 20 --no-pager

# Backups
ls -lh /opt/backups/daily/
crontab -l -u exptracker | grep backup
sudo tail -n 10 /var/log/expense-tracker/backup.log

# Service Management
sudo systemctl status expense-tracker
sudo systemctl restart expense-tracker
sudo systemctl stop expense-tracker
sudo systemctl start expense-tracker

# Manual Tests
sudo /opt/monitoring/scripts/health-check.sh
sudo /opt/backups/scripts/backup-app.sh
curl http://localhost:8000/
```

---

## 🎯 Tips for Successful Demo

1. **Practice beforehand** - Run through the demo at least twice
2. **Have commands ready** - Keep this guide open during presentation
3. **Explain as you go** - Don't just show commands, explain what they do
4. **Be prepared for questions** - Review the Q&A section
5. **Have backup plan** - If live demo fails, have screenshots ready
6. **Show confidence** - You built this, you know it!

---

## 📸 Screenshots to Prepare (Backup Plan)

Take screenshots of:
1. Firewall status (`sudo ufw status verbose`)
2. Monitoring dashboard (`monitor`)
3. Health check logs
4. Backup list
5. Service status
6. Ansible roles structure

---

## ✅ Pre-Demo Checklist

- [ ] Application is running
- [ ] Can SSH to server
- [ ] All services are active
- [ ] Logs exist and have recent entries
- [ ] Backups exist
- [ ] Practiced demo at least twice
- [ ] Have this guide open
- [ ] Have screenshots as backup
- [ ] Know answers to common questions

---

**Good luck with your presentation! You've built something impressive!** 🎉

**Last Updated:** November 9, 2025  
**Current IP:** 3.110.163.190
