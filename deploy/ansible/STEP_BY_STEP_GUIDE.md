# Step-by-Step Ansible Deployment Guide

## Quick Reference

**What you're deploying:** MERN Stack Expense Tracker  
**Where:** AWS EC2 (15.206.186.213)  
**How:** Ansible automation  
**Result:** Fully working app at http://15.206.186.213:8000

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] AWS EC2 instance running (Ubuntu)
- [ ] SSH key file (`MyKeyPair.pem`) in `~/.ssh/`
- [ ] Security Group allows ports 22, 80, 8000
- [ ] MongoDB Atlas connection string
- [ ] Git repository accessible
- [ ] Ansible installed (or WSL with Ansible)

---

## Step 1: Understand Your Files

### File Structure
```
deploy/ansible/
├── site.yml                      ← Main playbook (START HERE)
├── inventory/
│   ├── production.yml           ← Your server details
│   └── group_vars/
│       ├── all.yml              ← Public config
│       └── all.vault.yml        ← Secrets (ENCRYPTED)
└── roles/
    ├── common/                  ← Install Node.js, nginx
    ├── backend/                 ← Deploy backend
    └── frontend/                ← Build & deploy frontend
```

### What Each File Does

**`site.yml`** - The Master Plan
```yaml
---
- hosts: expense_tracker          # Which servers to deploy to
  become: yes                     # Use sudo
  roles:
    - common                      # Step 1: Setup server
    - mongo                       # Step 2: Setup MongoDB (optional)
    - backend                     # Step 3: Deploy backend
    - frontend                    # Step 4: Build frontend
```

**`inventory/production.yml`** - Server Information
```yaml
expense-tracker-1:
  ansible_host: 15.206.186.213              # Your server IP
  ansible_user: ubuntu                       # SSH username
  ansible_ssh_private_key_file: ~/.ssh/MyKeyPair.pem  # SSH key
```

**`inventory/group_vars/all.yml`** - Public Settings
```yaml
app_repo_url: https://github.com/Nithin-Rokkam/MERN-PROJECT.git
deploy_root: /opt/expense-tracker
backend_port: 8000
public_domain: 15.206.186.213
```

**`inventory/group_vars/all.vault.yml`** - Encrypted Secrets
```yaml
vault_frontend_env:
  VITE_API_URL: http://15.206.186.213:8000  # ← CRITICAL!

vault_backend_env:
  PORT: 8000
  CLIENT_URL: http://15.206.186.213
  MONGO_URL: mongodb+srv://user:pass@cluster.mongodb.net/expense-tracker
  JWT_SECRET: your-super-secret-jwt-key
```

---

## Step 2: Prepare Your Configuration

### Option A: Using WSL (Recommended for Windows)

#### 2.1 Install WSL
```powershell
# In PowerShell (Admin)
wsl --install
```
Restart your computer.

#### 2.2 Open WSL
```powershell
wsl
```

#### 2.3 Navigate to Project
```bash
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
```

#### 2.4 Install Ansible
```bash
sudo apt update
sudo apt install ansible -y
```

### Option B: Using Linux/Mac

```bash
# Navigate to project
cd ~/path/to/Expense-Tracker/deploy/ansible

# Ansible should already be installed
ansible --version
```

---

## Step 3: Configure Secrets

### 3.1 View Current Vault
```bash
ansible-vault view inventory/group_vars/all.vault.yml
```
Enter your vault password when prompted.

### 3.2 Edit Vault (If Needed)
```bash
ansible-vault edit inventory/group_vars/all.vault.yml
```

### 3.3 Ensure These Values Are Correct
```yaml
vault_frontend_env:
  VITE_API_URL: http://15.206.186.213:8000  # ← Must match your server IP!

vault_backend_env:
  PORT: 8000
  CLIENT_URL: http://15.206.186.213         # ← Your server IP
  MONGO_URL: mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
  JWT_SECRET: generate-a-random-secret-key-here
```

**Important Notes:**
- `VITE_API_URL` must include `:8000` port
- `MONGO_URL` must be your actual MongoDB Atlas connection string
- `JWT_SECRET` should be a long random string

### 3.4 Save and Exit
- Press `Esc`
- Type `:wq`
- Press `Enter`

---

## Step 4: Verify SSH Connection

### 4.1 Test SSH Access
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213
```

If successful, you'll see:
```
Welcome to Ubuntu...
ubuntu@ip-172-31-10-18:~$
```

Type `exit` to disconnect.

### 4.2 If SSH Fails

**Error: "Permission denied (publickey)"**
```bash
# Fix key permissions
chmod 400 ~/.ssh/MyKeyPair.pem

# Try again
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213
```

**Error: "No such file or directory"**
```bash
# Check if key exists
ls -la ~/.ssh/MyKeyPair.pem

# If not, copy it to the right location
cp /path/to/MyKeyPair.pem ~/.ssh/
chmod 400 ~/.ssh/MyKeyPair.pem
```

---

## Step 5: Run Ansible Deployment

### 5.1 Dry Run (Test First)
```bash
ansible-playbook -i inventory/production.yml site.yml --check --ask-vault-pass
```

This shows what **would** change without actually changing anything.

### 5.2 Full Deployment
```bash
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

**What happens:**
1. Ansible prompts for vault password
2. Connects to your server via SSH
3. Runs all roles in sequence
4. Shows progress for each task

### 5.3 Expected Output
```
PLAY [expense_tracker] *********************************************************

TASK [Gathering Facts] *********************************************************
ok: [expense-tracker-1]

TASK [common : Update apt cache] ***********************************************
changed: [expense-tracker-1]

TASK [common : Install Node.js] ************************************************
changed: [expense-tracker-1]

... (many more tasks)

TASK [frontend : Build frontend bundle] ****************************************
changed: [expense-tracker-1]

PLAY RECAP *********************************************************************
expense-tracker-1          : ok=45   changed=23   unreachable=0    failed=0
```

**Success Indicators:**
- `failed=0` - No failures
- `unreachable=0` - Server was accessible
- `changed=X` - X things were updated

---

## Step 6: Verify Deployment

### 6.1 Check Backend Service
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213 "sudo systemctl status expense-tracker"
```

Should show:
```
● expense-tracker.service - Expense Tracker Backend
   Active: active (running) since ...
```

### 6.2 Check Backend Logs
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213 "sudo journalctl -u expense-tracker -n 20"
```

Should show:
```
Server is running at port 8000
```

### 6.3 Test Backend API
```bash
curl http://15.206.186.213:8000/
```

Should return:
```json
{"message":"Expense Tracker API is running"}
```

### 6.4 Test Frontend
Open in browser: **http://15.206.186.213:8000**

You should see the Expense Tracker login page.

---

## Step 7: Test Login Functionality

### 7.1 Open Browser DevTools
1. Open **http://15.206.186.213:8000**
2. Press **F12** (or right-click → Inspect)
3. Go to **Network** tab

### 7.2 Attempt Login
1. Enter any email and password
2. Click **Login**
3. Watch the Network tab

### 7.3 Verify API Call
You should see a request to:
```
http://15.206.186.213:8000/api/v1/auth/login
```

**✅ If you see this URL:** Frontend is configured correctly!  
**❌ If you see `localhost:8000`:** Frontend needs rebuilding (see troubleshooting)

---

## Step 8: Create Test Account

### 8.1 Sign Up
1. Click **SignUp** link
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123456
3. Click **Create Account**

### 8.2 Verify Success
- Should redirect to dashboard
- Should see "Welcome, Test User"

---

## Understanding What Happened

### Timeline of Deployment

```
T+0s    Ansible connects to server
        ↓
T+5s    [COMMON ROLE]
        • Updates Ubuntu packages
        • Installs Node.js 20.x
        • Installs npm, git, nginx
        • Creates 'exptracker' user
        ↓
T+30s   [BACKEND ROLE]
        • Clones GitHub repo
        • Installs backend npm packages
        • Creates .env file with secrets
        • Creates systemd service
        • Starts backend on port 8000
        ↓
T+60s   [FRONTEND ROLE]
        • Installs frontend npm packages
        • Creates .env.production with API URL
        • Runs 'npm run build'
        • Builds React app (takes ~30s)
        • Output: /opt/expense-tracker/server/client/build/
        • Restarts backend (now serves frontend)
        ↓
T+90s   Deployment complete!
        App accessible at http://15.206.186.213:8000
```

### What's Running on the Server

```
┌─────────────────────────────────────────┐
│  Process: node server.js                 │
│  User: exptracker                        │
│  Port: 8000                              │
│  Managed by: systemd                     │
│                                          │
│  Serves:                                 │
│  • API: /api/v1/*                       │
│  • Frontend: /* (static files)          │
└─────────────────────────────────────────┘
```

### File Locations on Server

```
/opt/expense-tracker/
├── server/
│   ├── server.js              ← Backend entry point
│   ├── .env                   ← Backend config (MONGO_URL, JWT_SECRET)
│   ├── package.json
│   ├── node_modules/
│   └── client/
│       └── build/             ← Built React app (served by backend)
│           ├── index.html
│           └── assets/
│               ├── index.js   ← Contains hardcoded API URL!
│               └── index.css
└── client/
    └── expense-tracker/
        ├── .env.production    ← Frontend build config (VITE_API_URL)
        ├── src/               ← React source code
        └── node_modules/
```

---

## Troubleshooting Common Issues

### Issue 1: Login Still Fails

**Symptom:** "Something went wrong. Please try again."

**Diagnosis:**
```bash
# Check what API URL is in the built frontend
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213
cat /opt/expense-tracker/client/expense-tracker/.env.production
```

Should show:
```
VITE_API_URL=http://15.206.186.213:8000
```

**Fix:**
```bash
# Rebuild frontend with correct URL
cd /opt/expense-tracker/client/expense-tracker
echo "VITE_API_URL=http://15.206.186.213:8000" | sudo tee .env.production
sudo -u exptracker npm run build
sudo systemctl restart expense-tracker
```

### Issue 2: Backend Not Starting

**Symptom:** Service shows "failed" or "inactive"

**Diagnosis:**
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213
sudo journalctl -u expense-tracker -n 50
```

**Common Causes:**
1. **MongoDB connection failed**
   - Check MONGO_URL in `/opt/expense-tracker/server/.env`
   - Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)

2. **Port already in use**
   ```bash
   sudo lsof -i :8000
   # Kill the process if needed
   sudo kill -9 <PID>
   ```

3. **Missing dependencies**
   ```bash
   cd /opt/expense-tracker/server
   npm install
   sudo systemctl restart expense-tracker
   ```

### Issue 3: "EACCES: permission denied"

**Symptom:** Build fails with permission errors

**Fix:**
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213
sudo chown -R exptracker:exptracker /opt/expense-tracker
```

### Issue 4: Ansible Vault Password Forgotten

**Symptom:** Can't decrypt vault file

**Fix:** Recreate vault file
```bash
# Backup old vault
mv inventory/group_vars/all.vault.yml inventory/group_vars/all.vault.yml.old

# Create new vault file (unencrypted first)
cat > inventory/group_vars/all.vault.yml << 'EOF'
vault_frontend_env:
  VITE_API_URL: http://15.206.186.213:8000

vault_backend_env:
  PORT: 8000
  CLIENT_URL: http://15.206.186.213
  MONGO_URL: mongodb+srv://your-connection-string
  JWT_SECRET: your-new-secret-key
EOF

# Encrypt it
ansible-vault encrypt inventory/group_vars/all.vault.yml
```

---

## Redeployment (After Code Changes)

### Quick Redeploy
```bash
# Pull latest code and rebuild
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

### Deploy Only Frontend
```bash
ansible-playbook -i inventory/production.yml site.yml --tags frontend --ask-vault-pass
```

### Deploy Only Backend
```bash
ansible-playbook -i inventory/production.yml site.yml --tags backend --ask-vault-pass
```

---

## Manual Deployment (Without Ansible)

If Ansible isn't working, you can deploy manually:

```bash
# SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213

# Update code
cd /opt/expense-tracker
sudo -u exptracker git pull origin main

# Update backend
cd server
sudo -u exptracker npm install

# Update frontend
cd ../client/expense-tracker
echo "VITE_API_URL=http://15.206.186.213:8000" | sudo tee .env.production
sudo -u exptracker npm install
sudo -u exptracker npm run build

# Restart service
sudo systemctl restart expense-tracker
```

---

## Monitoring Your Application

### Check Service Status
```bash
sudo systemctl status expense-tracker
```

### View Live Logs
```bash
sudo journalctl -u expense-tracker -f
```

### Check Resource Usage
```bash
# CPU and Memory
top

# Disk space
df -h

# Network connections
sudo netstat -tlnp | grep :8000
```

---

## Security Checklist

- [ ] Vault file is encrypted
- [ ] SSH key has correct permissions (400)
- [ ] MongoDB uses strong password
- [ ] JWT_SECRET is random and long
- [ ] AWS Security Group limits access
- [ ] Regular backups configured
- [ ] SSL/HTTPS configured (optional but recommended)

---

## Next Steps

### 1. Set Up Domain Name
Instead of IP, use a domain:
```
http://expense-tracker.yourdomain.com
```

### 2. Add SSL/HTTPS
Use Let's Encrypt for free SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d expense-tracker.yourdomain.com
```

### 3. Set Up CI/CD
Automate deployment on git push using GitHub Actions.

### 4. Add Monitoring
- Set up error logging (Sentry)
- Add uptime monitoring (UptimeRobot)
- Configure alerts

---

## Summary

### What You Learned
1. ✅ How Ansible automates deployment
2. ✅ How to configure servers with roles
3. ✅ How to manage secrets with Vault
4. ✅ How to build and deploy a MERN app
5. ✅ How to troubleshoot deployment issues

### Key Commands
```bash
# Deploy everything
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass

# Check service
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213 "sudo systemctl status expense-tracker"

# View logs
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213 "sudo journalctl -u expense-tracker -f"

# Restart service
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213 "sudo systemctl restart expense-tracker"
```

### Your Application
**URL:** http://15.206.186.213:8000  
**Backend:** Node.js + Express  
**Frontend:** React + Vite  
**Database:** MongoDB Atlas  
**Deployment:** Ansible + Systemd  

---

## Need Help?

1. Check logs: `sudo journalctl -u expense-tracker -n 50`
2. Verify config: `cat /opt/expense-tracker/server/.env`
3. Test API: `curl http://localhost:8000/`
4. Review Ansible output for errors
5. Check the main README: `ANSIBLE_DEPLOYMENT_EXPLAINED.md`

**Congratulations! You've successfully deployed your application with Ansible!** 🎉
