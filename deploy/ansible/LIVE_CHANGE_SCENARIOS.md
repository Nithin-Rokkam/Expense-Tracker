# Live Change Scenarios for Demo

## 🎬 Safe Changes You Can Make During Presentation

These are safe, reversible changes you can demonstrate during your viva.

---

## Scenario 1: Change Firewall Rule (2 minutes)

### **What to demonstrate:** Adding/removing a firewall rule

```bash
# 1. Show current firewall rules
sudo ufw status numbered

# 2. Add a new rule (example: allow port 3000)
sudo ufw allow 3000/tcp comment 'Demo port'

# 3. Show the new rule was added
sudo ufw status numbered

# 4. Remove the rule (cleanup)
sudo ufw delete allow 3000/tcp

# 5. Verify it's removed
sudo ufw status numbered
```

**What to say:**
> "Let me demonstrate how we can modify firewall rules. I'll add a new port, verify it's allowed, then remove it. This shows how we can dynamically adjust security policies."

---

## Scenario 2: Test Fail2Ban (3 minutes)

### **What to demonstrate:** How Fail2Ban protects against attacks

**⚠️ Note:** This requires a second terminal or machine

```bash
# Terminal 1 (Your server)
# Watch Fail2Ban logs in real-time
sudo tail -f /var/log/fail2ban.log

# Terminal 2 (Another machine or WSL)
# Try to SSH with wrong password multiple times
ssh wronguser@3.110.163.190
# Enter wrong password 5 times

# Terminal 1 (Your server)
# Show the IP got banned
sudo fail2ban-client status sshd

# Unban the IP (cleanup)
sudo fail2ban-client set sshd unbanip <YOUR_IP>
```

**What to say:**
> "Fail2Ban monitors authentication attempts. After 5 failed attempts, it automatically bans the IP. Let me show you this in action."

**Alternative (if you can't do live test):**
```bash
# Show Fail2Ban configuration
sudo cat /etc/fail2ban/jail.local

# Explain the settings
# maxretry = 5
# bantime = 3600 (1 hour)
# findtime = 600 (10 minutes)
```

---

## Scenario 3: Modify Health Check Interval (3 minutes)

### **What to demonstrate:** Changing monitoring configuration

```bash
# 1. Show current health check schedule
crontab -l | grep health-check

# 2. Edit crontab
sudo crontab -e

# 3. Change from */5 to */2 (every 2 minutes instead of 5)
# Change this line:
*/5 * * * * /opt/monitoring/scripts/health-check.sh
# To:
*/2 * * * * /opt/monitoring/scripts/health-check.sh

# 4. Save and exit (Ctrl+X, Y, Enter)

# 5. Verify the change
crontab -l | grep health-check

# 6. Wait 2 minutes and show new log entries
sudo tail -f /var/log/expense-tracker/health-check.log

# 7. Revert back to 5 minutes (cleanup)
sudo crontab -e
# Change back to */5
```

**What to say:**
> "Our monitoring is configurable. Let me change the health check interval from 5 minutes to 2 minutes. This shows how we can adjust monitoring frequency based on requirements."

---

## Scenario 4: Manual Backup (2 minutes)

### **What to demonstrate:** Creating a backup on-demand

```bash
# 1. Show current backups
ls -lh /opt/backups/daily/

# 2. Create a manual backup
sudo /opt/backups/scripts/backup-app.sh

# 3. Show the new backup was created
ls -lh /opt/backups/daily/

# 4. Show backup log
sudo tail -n 5 /var/log/expense-tracker/backup.log

# 5. Show backup size
du -sh /opt/backups/daily/expense-tracker-app-*.tar.gz | tail -1
```

**What to say:**
> "While backups run automatically, we can also create manual backups anytime. Let me create one now and show you the backup log."

---

## Scenario 5: Service Restart with Monitoring (3 minutes)

### **What to demonstrate:** Auto-restart capability

```bash
# 1. Open two terminals side-by-side

# Terminal 1: Watch health check logs
sudo tail -f /var/log/expense-tracker/health-check.log

# Terminal 2: Stop the service
sudo systemctl stop expense-tracker

# Terminal 2: Verify it's stopped
sudo systemctl status expense-tracker

# Terminal 2: Manually trigger health check
sudo /opt/monitoring/scripts/health-check.sh

# Terminal 1: You'll see the auto-restart log entry

# Terminal 2: Verify it's running again
sudo systemctl status expense-tracker
```

**What to say:**
> "Our monitoring system includes self-healing. If the service stops, the health check detects it and automatically restarts it. Let me demonstrate this."

---

## Scenario 6: View and Analyze Logs (2 minutes)

### **What to demonstrate:** Log analysis capabilities

```bash
# 1. Show different log types
ls -l /var/log/expense-tracker/

# 2. Show recent application activity
sudo journalctl -u expense-tracker --since "10 minutes ago" --no-pager

# 3. Search for specific events (e.g., errors)
sudo journalctl -u expense-tracker | grep -i error | tail -10

# 4. Show log rotation configuration
cat /etc/logrotate.d/expense-tracker

# 5. Check log sizes
du -sh /var/log/expense-tracker/*
```

**What to say:**
> "We maintain comprehensive logs for debugging and auditing. Logs are automatically rotated daily and kept for 14 days. Let me show you the different log types and how we can search them."

---

## Scenario 7: Change Monitoring Threshold (3 minutes)

### **What to demonstrate:** Modifying alert thresholds

```bash
# 1. Show current monitoring script
sudo cat /opt/monitoring/scripts/system-monitor.sh | grep -A 3 "Alert if"

# 2. Edit the script
sudo nano /opt/monitoring/scripts/system-monitor.sh

# 3. Change threshold from 80 to 70
# Find these lines:
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
if [ "$DISK_USAGE" -gt 80 ]; then

# Change to:
if (( $(echo "$CPU_USAGE > 70" | bc -l) )); then
if (( $(echo "$MEMORY_USAGE > 70" | bc -l) )); then
if [ "$DISK_USAGE" -gt 70 ]; then

# 4. Save (Ctrl+X, Y, Enter)

# 5. Run the script manually to test
sudo /opt/monitoring/scripts/system-monitor.sh

# 6. Show the log
sudo tail -n 3 /var/log/expense-tracker/system-monitor.log

# 7. Revert back to 80 (cleanup)
```

**What to say:**
> "Alert thresholds are configurable. Let me change the CPU alert from 80% to 70% to demonstrate how we can adjust sensitivity based on requirements."

---

## Scenario 8: Add Custom Monitoring Script (4 minutes)

### **What to demonstrate:** Extending monitoring capabilities

```bash
# 1. Create a custom monitoring script
sudo nano /opt/monitoring/scripts/custom-check.sh

# 2. Add this content:
#!/bin/bash
# Custom monitoring script - Check disk space
LOG_FILE="/var/log/expense-tracker/custom-check.log"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Disk usage: ${DISK_USAGE}%" >> "$LOG_FILE"

if [ "$DISK_USAGE" -gt 75 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: Disk usage high!" >> "$LOG_FILE"
fi

# 3. Save and make executable
sudo chmod +x /opt/monitoring/scripts/custom-check.sh

# 4. Test the script
sudo /opt/monitoring/scripts/custom-check.sh

# 5. View the log
sudo cat /var/log/expense-tracker/custom-check.log

# 6. Add to crontab (optional)
sudo crontab -e
# Add: */10 * * * * /opt/monitoring/scripts/custom-check.sh

# 7. Show it was added
crontab -l | grep custom-check
```

**What to say:**
> "Our monitoring system is extensible. Let me create a custom monitoring script that checks disk space and add it to the monitoring schedule. This shows how we can add new monitoring capabilities as needed."

---

## Scenario 9: Demonstrate Ansible Idempotency (3 minutes)

### **What to demonstrate:** Ansible can be run multiple times safely

```bash
# From your local machine (WSL)
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# 1. Run Ansible in check mode (dry run)
ansible-playbook -i inventory/production.yml site.yml --check --ask-vault-pass

# 2. Show that running again won't break anything
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass

# 3. Show the output - most tasks will show "ok" (not "changed")
```

**What to say:**
> "Ansible is idempotent, meaning we can run it multiple times safely. It only makes changes when needed. Let me run the deployment again to show that it doesn't break anything."

---

## Scenario 10: Quick Configuration Update via Ansible (5 minutes)

### **What to demonstrate:** Updating configuration through Ansible

```bash
# From your local machine (WSL)
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# 1. Show current configuration
cat inventory/group_vars/all.yml | grep -A 3 "Monitoring Configuration"

# 2. Edit configuration
nano inventory/group_vars/all.yml

# 3. Change health_check_interval from 5 to 3
health_check_interval: 3

# 4. Save and exit

# 5. Deploy the change
ansible-playbook -i inventory/production.yml site.yml --tags monitoring --ask-vault-pass

# 6. SSH to server and verify
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190
crontab -l | grep health-check

# Should show: */3 instead of */5

# 7. Revert back to 5 (cleanup)
```

**What to say:**
> "With Ansible, we can update configuration centrally and deploy to all servers. Let me change the health check interval from 5 to 3 minutes and deploy it using Ansible."

---

## 🎯 Recommended Scenarios for Viva

**Choose 2-3 of these based on time:**

1. **Scenario 5** (Service Restart) - Shows self-healing
2. **Scenario 4** (Manual Backup) - Shows backup system
3. **Scenario 6** (Log Analysis) - Shows monitoring capabilities

**If you have more time:**
4. **Scenario 7** (Change Threshold) - Shows configurability
5. **Scenario 9** (Ansible Idempotency) - Shows Ansible benefits

---

## ⚠️ Important Tips

1. **Practice first!** - Try each scenario at least once before presentation
2. **Have cleanup steps ready** - Always revert changes after demo
3. **Know what to expect** - Understand the expected output
4. **Have backup plan** - If something fails, move to next scenario
5. **Explain as you go** - Don't just run commands silently

---

## 🔄 Cleanup After Demo

```bash
# Revert any firewall changes
sudo ufw status numbered
sudo ufw delete <rule-number>

# Revert crontab changes
sudo crontab -e
# Change back to original values

# Restart service if needed
sudo systemctl restart expense-tracker

# Verify everything is working
monitor
```

---

## 📋 Pre-Demo Checklist

- [ ] Application is running
- [ ] Can SSH to server
- [ ] Know your server IP
- [ ] Have vault password ready
- [ ] Practiced scenarios at least once
- [ ] Know cleanup steps
- [ ] Have this guide open

---

**You've got this! These scenarios will impress your evaluators!** 🎉
