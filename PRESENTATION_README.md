# Expense Tracker - MERN Stack Project
## 🎓 Class Presentation Guide

---

## 1️⃣ PROJECT INTRODUCTION (2 minutes)

### What is this project?
A **full-stack expense tracking application** that helps users manage their finances with real-time data visualization and secure authentication.

### Live Demo URL
**http://3.110.163.190:8000**

### Technology Stack
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Deployment:** AWS EC2 + Ansible
- **Security:** UFW Firewall + Fail2Ban
- **Monitoring:** Automated health checks + backups

---

## 2️⃣ PROJECT OBJECTIVES (1 minute)

✅ Build a production-ready MERN application  
✅ Implement secure user authentication (JWT)  
✅ Deploy on cloud infrastructure (AWS EC2)  
✅ Add enterprise-grade security features  
✅ Automate monitoring and backups  
✅ Use Infrastructure as Code (Ansible)

---

## 3️⃣ KEY FEATURES (1 minute)

### User Features
- 🔐 Secure signup/login with JWT authentication
- 💰 Track income and expenses with categories
- 📊 Visual dashboard with charts
- 📈 Real-time balance calculation
- 🎯 Category-wise expense breakdown

### Technical Features
- 🛡️ Multi-layer security (Firewall + Fail2Ban)
- 📡 Automated health monitoring (every 5 min)
- 💾 Daily automated backups (2 AM)
- 🔄 Self-healing (auto-restart on failure)
- 🚀 One-command deployment with Ansible

---

## 4️⃣ ARCHITECTURE OVERVIEW (2 minutes)

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  AWS EC2 (Ubuntu 22.04)         │
│  ┌───────────────────────────┐  │
│  │  Nginx (Reverse Proxy)    │  │
│  └───────────┬───────────────┘  │
│              │                   │
│  ┌───────────▼───────────────┐  │
│  │  React Frontend (Vite)    │  │
│  │  Port: 8000               │  │
│  └───────────┬───────────────┘  │
│              │                   │
│  ┌───────────▼───────────────┐  │
│  │  Express Backend          │  │
│  │  Node.js + JWT Auth       │  │
│  └───────────┬───────────────┘  │
│              │                   │
│  ┌───────────▼───────────────┐  │
│  │  Security Layer           │  │
│  │  - UFW Firewall           │  │
│  │  - Fail2Ban               │  │
│  │  - SSH Hardening          │  │
│  └───────────────────────────┘  │
│                                  │
│  ┌───────────────────────────┐  │
│  │  Monitoring & Backup      │  │
│  │  - Health Checks (5 min)  │  │
│  │  - System Monitor (15min) │  │
│  │  - Daily Backups (2 AM)   │  │
│  └───────────────────────────┘  │
└──────────────┬──────────────────┘
               │
               ▼
      ┌────────────────┐
      │ MongoDB Atlas  │
      │ (Cloud DB)     │
      └────────────────┘
```

---

## 5️⃣ LIVE APPLICATION DEMO (7 minutes)

### Demo Script

#### Step 1: User Registration (1 min)
```
1. Open browser: http://3.110.163.190:8000
2. Click "Sign Up"
3. Enter:
   - Name: Demo User
   - Email: demo@example.com
   - Password: Demo@123
4. Click "Register"
```

**What to say:**
> "The application uses JWT tokens for authentication and bcrypt for password hashing, ensuring secure user data protection."

---

#### Step 2: Add Income (1 min)
```
1. Login with credentials
2. Go to "Add Income"
3. Enter:
   - Title: Monthly Salary
   - Amount: 50000
   - Category: Salary
   - Date: Today
4. Click "Add Income"
```

**What to say:**
> "All transactions are stored in MongoDB Atlas with user isolation - each user can only see their own data."

---

#### Step 3: Add Expenses (2 min)
```
Add multiple expenses:
1. Food & Groceries: 5000
2. Transportation: 2000
3. Entertainment: 1500
4. Utilities: 1000
5. Healthcare: 800
```

**What to say:**
> "The application supports multiple expense categories, making it easy to track where money is being spent."

---

#### Step 4: View Dashboard (2 min)
```
1. Navigate to Dashboard
2. Show:
   - Total Balance (50000 - 10300 = 39700)
   - Income vs Expense chart
   - Category-wise breakdown
   - Recent transactions list
```

**What to say:**
> "The dashboard provides visual insights through Chart.js, helping users understand their spending patterns at a glance."

---

#### Step 5: Edit/Delete Transaction (1 min)
```
1. Click on any transaction
2. Edit amount or category
3. Save changes
4. Delete a transaction
5. Show updated balance
```

**What to say:**
> "Users have full CRUD operations - Create, Read, Update, and Delete transactions with real-time balance updates."

---

## 6️⃣ SECURITY DEMONSTRATION (5 minutes)

### SSH to Server
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190
```

### Demo 1: Firewall Protection (1 min)
```bash
sudo ufw status verbose
```

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

**What to say:**
> "UFW firewall is configured to allow only necessary ports - SSH (22), HTTP (80), HTTPS (443), and our application (8000). All other ports are blocked."

---

### Demo 2: Fail2Ban Protection (2 min)
```bash
sudo fail2ban-client status sshd
```

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

**What to say:**
> "Fail2Ban monitors SSH login attempts. After 5 failed attempts, the IP is banned for 1 hour. This protects against brute-force attacks."

---

### Demo 3: SSH Hardening (1 min)
```bash
sudo cat /etc/ssh/sshd_config | grep -E "PermitRootLogin|PasswordAuthentication"
```

**What to say:**
> "We've disabled root login and enforce key-based authentication for enhanced security."

---

### Demo 4: Service Status (1 min)
```bash
sudo systemctl status expense-tracker
```

**What to say:**
> "The application runs as a systemd service, ensuring it starts automatically on server reboot."

---

## 7️⃣ MONITORING DEMONSTRATION (5 minutes)

### Demo 1: Monitoring Dashboard (1 min)
```bash
monitor
```

**What to say:**
> "This custom monitoring dashboard shows real-time service status, system resources, and recent logs."

---

### Demo 2: Health Check Logs (1 min)
```bash
sudo tail -n 10 /var/log/expense-tracker/health-check.log
```

**Expected Output:**
```
[2025-11-09 14:00:01] ✓ Service is running
[2025-11-09 14:05:01] ✓ Service is running
[2025-11-09 14:10:01] ✓ Service is running
```

**What to say:**
> "Health checks run every 5 minutes. If the service is down, it automatically restarts."

---

### Demo 3: System Monitoring (1 min)
```bash
sudo tail -n 5 /var/log/expense-tracker/system-monitor.log
```

**What to say:**
> "System monitoring tracks CPU, memory, and disk usage every 15 minutes to ensure optimal performance."

---

### Demo 4: Backup System (2 min)
```bash
ls -lh /opt/backups/daily/
sudo tail -n 10 /var/log/expense-tracker/backup.log
```

**Expected Output:**
```
-rw-r--r-- 1 exptracker exptracker 2.3M Nov 09 02:00 expense-tracker-app-20251109_020001.tar.gz
-rw-r--r-- 1 exptracker exptracker 1.1M Nov 09 02:30 expense-tracker-config-20251109_023001.tar.gz
```

**What to say:**
> "Automated backups run daily at 2 AM for application files and 2:30 AM for configuration. We keep 7 days of daily backups and 4 weeks of weekly backups."

---

## 8️⃣ SELF-HEALING DEMO (3 minutes)

### Live Demo: Auto-Restart

```bash
# Step 1: Stop the service
sudo systemctl stop expense-tracker

# Step 2: Check status (should be inactive)
sudo systemctl status expense-tracker

# Step 3: Run health check manually
sudo /opt/monitoring/scripts/health-check.sh

# Step 4: Check status again (should be active)
sudo systemctl status expense-tracker

# Step 5: View the restart log
sudo tail -n 3 /var/log/expense-tracker/health-check.log
```

**Expected Log:**
```
[2025-11-09 14:15:01] ✗ Service is not running
[2025-11-09 14:15:01] ⚠ Attempting to restart service...
[2025-11-09 14:15:02] ✓ Service restarted successfully
```

**What to say:**
> "This demonstrates our self-healing capability. When the service fails, the health check automatically detects and restarts it within 5 minutes, ensuring high availability without manual intervention."

---

## 9️⃣ DEVOPS & AUTOMATION (3 minutes)

### Exit server and show Ansible

```bash
exit  # Exit from server
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
```

### Show Ansible Structure
```bash
ls -l roles/
```

**Expected Output:**
```
backup/
backend/
common/
frontend/
mongo/
monitoring/
security/
```

### Show Main Playbook
```bash
cat site.yml
```

**What to say:**
> "We use Ansible for Infrastructure as Code. This playbook defines our entire infrastructure - from server setup to security configuration. With one command, we can deploy the complete stack on any server."

---

### Show Deployment Command
```bash
# This is the single command that deploys everything:
ansible-playbook -i inventory/hosts site.yml
```

**What to say:**
> "This single command deploys:
> - Application code (frontend + backend)
> - Security (firewall + Fail2Ban)
> - Monitoring (health checks + system monitoring)
> - Backups (automated daily and weekly)
> - All configurations and services
>
> This makes deployments reproducible, eliminates manual errors, and enables rapid scaling."

---

## 🔟 TECHNICAL DEEP DIVE (If asked)

### Database Schema

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  createdAt: Date
}
```

**Transactions Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  title: String,
  amount: Number,
  type: String (income/expense),
  category: String,
  date: Date,
  createdAt: Date
}
```

---

### Authentication Flow

```
1. User registers → Password hashed with bcrypt → Stored in DB
2. User logs in → Password verified → JWT token generated
3. Token sent to client → Stored in localStorage
4. Every request → Token sent in Authorization header
5. Backend verifies token → Grants/denies access
```

---

### Deployment Architecture

```
Developer → Git Push → GitHub Repository
                          ↓
                    Ansible Playbook
                          ↓
                ┌─────────┴─────────┐
                ▼                   ▼
           AWS EC2            Configuration
                ↓                   ↓
         ┌──────┴──────┬──────┬────┴────┐
         ▼             ▼      ▼         ▼
    Application   Security  Monitor  Backup
```

---

## 1️⃣1️⃣ VIVA QUESTIONS & ANSWERS

### Architecture Questions

**Q: Why did you choose MERN stack?**
> **A:** MERN provides a unified JavaScript ecosystem across frontend and backend, reducing context switching. MongoDB offers flexible schema for evolving requirements, Express is lightweight and fast, React enables component-based UI development, and Node.js provides scalable event-driven architecture.

**Q: How does JWT authentication work?**
> **A:** When a user logs in, the server verifies credentials and generates a JWT token containing user information. This token is sent to the client and stored in localStorage. For subsequent requests, the client sends this token in the Authorization header. The server verifies the token's signature and expiry before granting access. This is stateless - no session storage needed on the server.

**Q: Why MongoDB Atlas instead of local MongoDB?**
> **A:** MongoDB Atlas provides managed cloud database with automatic backups, high availability, built-in security, automatic scaling, and monitoring. It eliminates database maintenance overhead and provides better reliability than self-hosted solutions.

**Q: Explain your database schema design.**
> **A:** We have two collections - Users and Transactions. Users store authentication data with bcrypt-hashed passwords. Transactions reference users via userId, ensuring data isolation. Each user can only access their own transactions through backend validation.

---

### Security Questions

**Q: What security measures have you implemented?**
> **A:** Multi-layer security:
> 1. **Application:** JWT authentication, bcrypt password hashing
> 2. **Network:** UFW firewall allowing only necessary ports
> 3. **Access:** Fail2Ban protecting against brute-force (5 attempts = 1 hour ban)
> 4. **SSH:** Hardening with root login disabled, key-based auth
> 5. **Secrets:** Ansible Vault for encrypted credential storage
> 6. **Updates:** Automatic security updates enabled

**Q: What if JWT secret is compromised?**
> **A:** Immediately rotate the JWT secret in environment variables, invalidate all existing tokens, force all users to re-login, investigate the breach source, and update the secret in Ansible Vault. The impact is limited as tokens have expiry times.

**Q: How do you prevent SQL injection?**
> **A:** We use MongoDB which is NoSQL, but we still prevent injection by:
> 1. Using Mongoose ODM with schema validation
> 2. Sanitizing user inputs
> 3. Using parameterized queries
> 4. Validating data types before database operations

**Q: Explain Fail2Ban configuration.**
> **A:** Fail2Ban monitors `/var/log/auth.log` for failed SSH attempts. After 5 failed attempts from an IP within 10 minutes, that IP is banned for 1 hour. This protects against brute-force attacks while allowing legitimate users who mistype passwords.

---

### Deployment Questions

**Q: Why use Ansible instead of manual deployment?**
> **A:** Ansible provides Infrastructure as Code with these benefits:
> 1. **Reproducibility:** Same deployment every time
> 2. **Version Control:** Infrastructure changes tracked in Git
> 3. **Idempotency:** Safe to run multiple times
> 4. **Scalability:** Deploy to multiple servers easily
> 5. **Documentation:** Playbooks document the infrastructure
> 6. **Error Reduction:** Eliminates manual mistakes

**Q: What is idempotency in Ansible?**
> **A:** Idempotency means running the same playbook multiple times produces the same result without side effects. Ansible checks the current state before making changes. If a package is already installed, it won't reinstall. This makes deployments safe and predictable.

**Q: How do you handle deployment failures?**
> **A:** Ansible provides detailed error messages showing which task failed. We can fix the issue and re-run the playbook - it will skip completed tasks and continue from the failure point. We also maintain backups for rollback if needed.

**Q: How would you scale this to multiple servers?**
> **A:** Add server IPs to Ansible inventory file, configure load balancer (Nginx/HAProxy), use shared database (already using MongoDB Atlas), implement session management, and run the same playbook across all servers. Ansible handles parallel deployment.

---

### Monitoring Questions

**Q: How do you ensure high availability?**
> **A:** Multiple mechanisms:
> 1. **Health Checks:** Every 5 minutes, auto-restart on failure
> 2. **System Monitoring:** Track resources every 15 minutes
> 3. **Automated Backups:** Daily backups for disaster recovery
> 4. **Systemd Service:** Auto-start on server reboot
> 5. **Logging:** Comprehensive logs for debugging

**Q: Explain your backup strategy.**
> **A:** Three-tier backup:
> 1. **Daily Application Backup:** 2:00 AM, 7-day retention
> 2. **Daily Config Backup:** 2:30 AM, 7-day retention
> 3. **Weekly Full Backup:** Sunday 3:00 AM, 4-week retention
> All backups are automated via cron jobs and logged.

**Q: What happens if the service crashes?**
> **A:** The health check script runs every 5 minutes. If it detects the service is down, it automatically attempts to restart it. All events are logged. If restart fails, we receive alerts and can investigate logs to identify the root cause.

**Q: How do you monitor system resources?**
> **A:** System monitor script runs every 15 minutes, checking:
> - CPU usage (alert if >80%)
> - Memory usage (alert if >85%)
> - Disk usage (alert if >90%)
> - Service status
> All metrics are logged for trend analysis.

---

### Development Questions

**Q: How does the frontend communicate with backend?**
> **A:** Frontend uses Axios for HTTP requests to backend API endpoints. All requests include JWT token in Authorization header. Backend validates token, processes request, and returns JSON response. CORS is configured to allow frontend domain.

**Q: How do you handle errors in the application?**
> **A:** Multi-level error handling:
> 1. **Frontend:** Try-catch blocks, user-friendly error messages
> 2. **Backend:** Express error middleware, proper HTTP status codes
> 3. **Database:** Mongoose validation, connection error handling
> 4. **Logging:** All errors logged with timestamps and context

**Q: What is the purpose of Vite in your project?**
> **A:** Vite is a modern build tool that provides:
> 1. **Fast Development:** Hot Module Replacement (HMR)
> 2. **Optimized Builds:** Tree-shaking, code splitting
> 3. **Modern Features:** ES modules, TypeScript support
> 4. **Better DX:** Faster than Create React App

---

### Database Questions

**Q: How do you ensure data consistency?**
> **A:** 
> 1. Mongoose schema validation
> 2. Unique constraints on email field
> 3. Transaction references validated before operations
> 4. Atomic operations for updates
> 5. Regular backups for data recovery

**Q: How would you optimize database queries?**
> **A:** 
> 1. Create indexes on frequently queried fields (userId, email)
> 2. Use projection to fetch only required fields
> 3. Implement pagination for large datasets
> 4. Use aggregation pipeline for complex queries
> 5. Monitor slow queries with MongoDB Atlas

---

## 1️⃣2️⃣ CONCLUSION (2 minutes)

### Project Summary

✅ **Full-Stack Application:** Complete MERN stack implementation  
✅ **Secure Authentication:** JWT + bcrypt for data protection  
✅ **Cloud Deployment:** Production-ready on AWS EC2  
✅ **Enterprise Security:** Firewall + Fail2Ban + SSH hardening  
✅ **Automated Monitoring:** Health checks + system monitoring  
✅ **Self-Healing:** Auto-restart on failures  
✅ **Automated Backups:** Daily and weekly backups  
✅ **Infrastructure as Code:** Ansible for reproducible deployments  

---

### Key Achievements

1. **Production-Ready:** Not just a demo, but a fully functional production system
2. **Security-First:** Multiple layers of security protection
3. **Automation:** Minimal manual intervention required
4. **Reliability:** Self-healing and automated backups
5. **Scalability:** Can be deployed to multiple servers easily
6. **Best Practices:** Industry-standard tools and methodologies

---

### Real-World Applications

- **Personal Finance Management:** Track expenses and budgets
- **Small Business:** Monitor business expenses and income
- **Freelancers:** Track project-based income and expenses
- **Students:** Learn production deployment practices
- **Startups:** Foundation for financial management features

---

### Future Enhancements

- 📱 Mobile app (React Native)
- 📊 Advanced analytics and reports
- 💳 Bank account integration
- 🔔 Budget alerts and notifications
- 📧 Email reports
- 🌍 Multi-currency support
- 👥 Family/team expense sharing

---

### Final Statement

> "This project demonstrates not just application development, but **production-ready deployment** with enterprise-grade security, monitoring, and automation. It showcases the complete software development lifecycle from coding to deployment and maintenance. Thank you!"

---

## 1️⃣3️⃣ PRE-PRESENTATION CHECKLIST

### 15 Minutes Before Presentation

```bash
# 1. Verify application is running
curl http://3.110.163.190:8000/

# 2. SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@3.110.163.190

# 3. Check all services
sudo systemctl status expense-tracker
sudo ufw status
sudo fail2ban-client status sshd

# 4. Check monitoring
monitor

# 5. Check backups exist
ls -lh /opt/backups/daily/

# 6. Check logs have recent entries
sudo tail -n 5 /var/log/expense-tracker/health-check.log

# 7. Exit server
exit
```

### Final Checklist

- [ ] Application URL is accessible
- [ ] Can SSH to server successfully
- [ ] All services are active
- [ ] Logs show recent activity
- [ ] Backups exist in /opt/backups/
- [ ] Practiced demo 2-3 times
- [ ] Know answers to common questions
- [ ] Have screenshots as backup (in case of network issues)
- [ ] Laptop is fully charged
- [ ] Have SSH key ready
- [ ] Browser bookmarks set

---

## 1️⃣4️⃣ EMERGENCY BACKUP PLAN

### If Server is Down

1. Show screenshots of working application
2. Explain architecture using diagrams
3. Show code structure locally
4. Demonstrate Ansible playbooks
5. Show logs and monitoring screenshots

### If Network is Slow

1. Use local demo (if available)
2. Show pre-recorded video
3. Focus more on code explanation
4. Show architecture and design decisions

### If SSH Fails

1. Show server status from AWS console
2. Use screenshots of monitoring dashboard
3. Explain monitoring and security features theoretically
4. Show Ansible configuration files

---

## 1️⃣5️⃣ QUICK REFERENCE COMMANDS

### Application
```bash
# Check if running
curl http://3.110.163.190:8000/

# Service management
sudo systemctl status expense-tracker
sudo systemctl restart expense-tracker
sudo systemctl stop expense-tracker
sudo systemctl start expense-tracker
```

### Security
```bash
# Firewall
sudo ufw status verbose
sudo ufw status numbered

# Fail2Ban
sudo fail2ban-client status
sudo fail2ban-client status sshd

# SSH config
sudo cat /etc/ssh/sshd_config | grep -E "PermitRootLogin|PasswordAuthentication"
```

### Monitoring
```bash
# Dashboard
monitor

# Logs
sudo tail -f /var/log/expense-tracker/health-check.log
sudo tail -f /var/log/expense-tracker/system-monitor.log
sudo tail -f /var/log/expense-tracker/backup.log
sudo tail -f /var/log/expense-tracker/app.log

# Backups
ls -lh /opt/backups/daily/
ls -lh /opt/backups/weekly/
```

### System
```bash
# Resources
htop
df -h
free -h

# Processes
ps aux | grep node
ps aux | grep nginx
```

---

## 📚 DOCUMENTATION REFERENCES

- **PRESENTATION_DEMO_GUIDE.md** - Detailed 15-min demo script
- **DEMO_QUICK_REFERENCE.md** - One-page command cheatsheet
- **LIVE_CHANGE_SCENARIOS.md** - 10 safe live demo scenarios
- **SECURITY_MONITORING_GUIDE.md** - Complete security documentation
- **DEPLOYMENT_SUMMARY.md** - Infrastructure overview

---

## 🎯 PRESENTATION TIPS

1. **Start Strong:** Begin with live demo to grab attention
2. **Be Confident:** You built this, you know it best
3. **Explain Simply:** Avoid jargon, explain technical terms
4. **Show, Don't Tell:** Live demos are more impressive than slides
5. **Handle Questions:** If you don't know, say "I'll research and get back to you"
6. **Time Management:** Keep track of time, prioritize important parts
7. **Backup Plan:** Have screenshots ready in case of technical issues
8. **Practice:** Run through the demo 2-3 times before presentation

---

**Project Status:** ✅ Production Ready  
**Last Updated:** November 9, 2025  
**Server IP:** 3.110.163.190  
**Application URL:** http://3.110.163.190:8000

---

## 🎉 GOOD LUCK WITH YOUR PRESENTATION!

**Remember:** You've built a production-ready application with enterprise features. Be proud of your work and present with confidence!

---

**Quick Start for Tomorrow:**
1. Read sections 1-5 (Introduction to Architecture)
2. Practice section 5 (Live Demo) 3 times
3. Memorize section 11 (Viva Q&A)
4. Run section 13 (Pre-presentation checklist) 15 min before class
5. Keep section 15 (Quick Reference) open during presentation
