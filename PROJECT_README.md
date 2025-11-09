# Expense Tracker - Full Stack MERN Application

## 📋 Project Overview

A comprehensive expense tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) and deployed on AWS EC2 with enterprise-grade security, monitoring, and automated backups using Ansible.

**Live Application:** http://3.110.163.190:8000

---

## 🎯 Project Objectives

### Primary Goals
1. **Financial Management** - Help users track income and expenses efficiently
2. **Data Visualization** - Provide insights through charts and analytics
3. **Secure Authentication** - Protect user data with JWT-based authentication
4. **Cloud Deployment** - Deploy on AWS with automated infrastructure management
5. **Production-Ready** - Implement security, monitoring, and backup systems

---

## 🌟 Key Features

### User Features
- **User Authentication** - Secure signup/login with JWT
- **Expense Management** - Add, edit, delete expenses with categories
- **Income Tracking** - Record income sources
- **Data Visualization** - Charts showing spending patterns
- **Dashboard** - Overview of balance, income, expenses

### Technical Features
- **Security** - UFW Firewall, Fail2Ban, SSH hardening
- **Monitoring** - Health checks, system monitoring, auto-restart
- **Backups** - Automated daily and weekly backups
- **Infrastructure as Code** - Ansible for deployment

---

## 🏗️ Technology Stack

**Frontend:** React 18, Vite, Axios, Chart.js  
**Backend:** Node.js, Express.js, JWT, Bcrypt  
**Database:** MongoDB Atlas  
**Infrastructure:** AWS EC2, Ansible, UFW, Fail2Ban, Systemd

---

## 💼 Use Cases

### 1. Personal Finance Management
Track daily expenses, understand spending habits, and make informed financial decisions.

### 2. Budget Planning
View income vs expenses, see current balance, and plan future budgets.

### 3. Expense Analysis
Visualize expenses by category, identify highest spending areas, and adjust habits.

### 4. Secure Multi-User System
Each user's data is private and protected with enterprise-grade security.

### 5. Reliable Cloud Service
High availability with automated monitoring, backups, and self-healing.

---

## 🎯 Benefits

**For Users:**
- Better financial control and awareness
- Easy-to-use interface
- Visual insights with charts
- Secure and reliable service

**For Developers:**
- Modern tech stack
- Scalable architecture
- Automated deployment
- Comprehensive monitoring

**For Business:**
- Cost-effective (open-source stack)
- Professional features
- Easy to maintain
- Industry-standard security

---

## 🎬 Presentation Demo Guide

### Pre-Presentation Checklist (Run 15 min before)

```bash
# 1. Verify application
curl http://3.110.163.190:8000/

# 2. SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190

# 3. Check services
sudo systemctl status expense-tracker
sudo ufw status
sudo fail2ban-client status
monitor
ls -l /opt/backups/daily/
```

---

### Presentation Flow (20-25 minutes)

#### **Part 1: Introduction (3 min)**
- Introduce project and objectives
- Show architecture diagram
- Highlight key features

#### **Part 2: Application Demo (7 min)**

**Step 1: User Registration**
```
1. Open: http://3.110.163.190:8000
2. Click "Sign Up"
3. Enter: Name, Email, Password
4. Show successful registration
```

**What to say:**
> "The application uses secure JWT authentication with bcrypt password hashing for security."

**Step 2: Add Transactions**
```
1. Add Income: Salary - 50000
2. Add Expenses:
   - Food: 5000
   - Transport: 2000
   - Entertainment: 1500
```

**What to say:**
> "Users can easily track income and expenses with categories. All data is stored securely in MongoDB Atlas."

**Step 3: View Dashboard**
```
1. Show total balance
2. Show expense breakdown chart
3. Show recent transactions
```

**What to say:**
> "The dashboard provides visual insights through charts, helping users understand their spending patterns."

---

#### **Part 3: Security Demo (5 min)**

```bash
# SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190

# Show firewall
sudo ufw status verbose

# Show Fail2Ban
sudo fail2ban-client status sshd

# Show SSH hardening
sudo cat /etc/ssh/sshd_config | grep PermitRootLogin
```

**What to say:**
> "We have multi-layer security: UFW firewall allows only necessary ports, Fail2Ban protects against brute-force attacks (5 attempts = 1 hour ban), and SSH hardening disables root login for extra protection."

---

#### **Part 4: Monitoring Demo (5 min)**

```bash
# Show monitoring dashboard
monitor

# Show health check logs
sudo tail -n 10 /var/log/expense-tracker/health-check.log

# Show system monitoring
sudo tail -n 5 /var/log/expense-tracker/system-monitor.log

# Show backups
ls -lh /opt/backups/daily/
sudo tail -n 10 /var/log/expense-tracker/backup.log
```

**What to say:**
> "We have automated health checks every 5 minutes, system monitoring every 15 minutes, and automated daily backups at 2 AM. The system includes self-healing - if the service fails, it automatically restarts."

---

#### **Part 5: Live Demo - Auto-Restart (3 min)**

```bash
# Stop service
sudo systemctl stop expense-tracker

# Show it's stopped
sudo systemctl status expense-tracker

# Run health check
sudo /opt/monitoring/scripts/health-check.sh

# Show it restarted
sudo systemctl status expense-tracker

# Show log
sudo tail -n 3 /var/log/expense-tracker/health-check.log
```

**What to say:**
> "This demonstrates our self-healing capability. When the service fails, the health check detects it and automatically restarts it, ensuring high availability."

---

#### **Part 6: DevOps & Automation (3 min)**

```bash
exit  # Exit server
cd deploy/ansible
ls -l roles/
cat site.yml
```

**What to say:**
> "We use Ansible for Infrastructure as Code. With one command, we can deploy the entire stack including security and monitoring. This makes deployments reproducible and eliminates manual errors."

---

#### **Part 7: Conclusion (2 min)**

**Summary:**
- ✅ Full-stack MERN application
- ✅ Secure authentication and data protection
- ✅ Enterprise-grade security (Firewall, Fail2Ban)
- ✅ Automated monitoring and self-healing
- ✅ Daily backups for data safety
- ✅ Infrastructure as Code with Ansible
- ✅ Production-ready deployment

**Final statement:**
> "This project demonstrates not just application development, but production-ready deployment with security, monitoring, and automation. Thank you!"

---

## ❓ Common Viva Questions & Answers

### Architecture

**Q: Why MERN stack?**
> A: Unified JavaScript ecosystem, flexible MongoDB schema, lightweight Express, component-based React, scalable Node.js.

**Q: How does authentication work?**
> A: JWT tokens for stateless authentication, bcrypt for password hashing, tokens verified on each request.

**Q: Database schema?**
> A: Two collections - Users (credentials, profile) and Transactions (amount, category, user reference). Ensures data isolation.

### Security

**Q: Security measures?**
> A: UFW firewall, Fail2Ban (5 attempts = 1 hour ban), SSH hardening (no root login), automatic updates, JWT auth, bcrypt hashing, Ansible Vault for secrets.

**Q: JWT secret compromise?**
> A: Immediately rotate secret, invalidate all tokens, users re-login. Stored encrypted in Ansible Vault.

**Q: Password security?**
> A: Bcrypt hashing with salt factor 10, never store plain text, enforce complexity requirements.

### Deployment

**Q: Why Ansible?**
> A: Infrastructure as Code, reproducible deployments, version-controlled, eliminates manual errors, idempotent, scalable.

**Q: What is idempotency?**
> A: Running playbook multiple times produces same result safely. Ansible checks current state before changes.

**Q: Handle deployment failures?**
> A: Ansible shows detailed errors, fix and re-run (skips completed tasks), maintain backups for rollback.

### Monitoring

**Q: High availability?**
> A: Health checks every 5 min, auto-restart on failure, system monitoring, automated backups, monitoring alerts.

**Q: Backup strategy?**
> A: Daily application backups (2 AM, 7-day retention), daily config backups (2:30 AM), weekly full backups (Sunday 3 AM, 4-week retention).

**Q: Handle service failures?**
> A: Health checks detect failures, automatically restart service, log all events, monitoring alerts notify issues.

---

## 📊 System Status

| Feature | Status | Details |
|---------|--------|---------|
| Application | ✅ Running | http://3.110.163.190:8000 |
| Firewall | ✅ Active | Ports 22, 80, 443, 8000 |
| Fail2Ban | ✅ Running | SSH protection enabled |
| Health Checks | ✅ Scheduled | Every 5 minutes |
| System Monitor | ✅ Scheduled | Every 15 minutes |
| Daily Backups | ✅ Scheduled | 2:00 AM & 2:30 AM |
| Weekly Backups | ✅ Scheduled | Sunday 3:00 AM |

---

## 🚀 Quick Commands

### Check Application
```bash
curl http://3.110.163.190:8000/
```

### SSH to Server
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190
```

### Security
```bash
sudo ufw status verbose
sudo fail2ban-client status sshd
```

### Monitoring
```bash
monitor
sudo tail -f /var/log/expense-tracker/health-check.log
```

### Backups
```bash
ls -lh /opt/backups/daily/
sudo tail -n 10 /var/log/expense-tracker/backup.log
```

### Service Management
```bash
sudo systemctl status expense-tracker
sudo systemctl restart expense-tracker
```

---

## 📚 Documentation

- **PRESENTATION_DEMO_GUIDE.md** - Complete 15-min demo script
- **DEMO_QUICK_REFERENCE.md** - One-page command reference
- **LIVE_CHANGE_SCENARIOS.md** - 10 safe live demo scenarios
- **SECURITY_MONITORING_GUIDE.md** - Complete feature documentation
- **DEPLOYMENT_SUMMARY.md** - Overview of all features

---

## ✅ Pre-Presentation Final Checklist

- [ ] Application is running
- [ ] Can SSH to server
- [ ] All services active
- [ ] Logs have recent entries
- [ ] Backups exist
- [ ] Practiced demo 2-3 times
- [ ] Know answers to common questions
- [ ] Have screenshots as backup

---

**Project Status:** ✅ Production Ready  
**Last Updated:** November 9, 2025  
**Server IP:** 3.110.163.190  
**Application URL:** http://3.110.163.190:8000

**Good luck with your presentation!** 🎉
