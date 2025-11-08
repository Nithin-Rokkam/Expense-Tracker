# Ansible Deployment Process - Complete Explanation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [How Ansible Works](#how-ansible-works)
4. [Your Deployment Structure](#your-deployment-structure)
5. [Step-by-Step Deployment Process](#step-by-step-deployment-process)
6. [What Happens Behind the Scenes](#what-happens-behind-the-scenes)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Ansible?
Ansible is an **automation tool** that helps you:
- Configure servers automatically
- Deploy applications consistently
- Manage infrastructure as code
- Avoid manual SSH commands and repetitive tasks

### Why Use Ansible for This Project?
Instead of manually:
1. SSHing to your AWS server
2. Installing Node.js, MongoDB, Nginx
3. Cloning your code
4. Building the frontend
5. Starting services

Ansible does **all of this automatically** with one command!

---

## Architecture

### Your Application Stack
```
┌─────────────────────────────────────────────────────────────┐
│                     AWS EC2 Instance                         │
│                   (15.206.186.213)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Nginx (Port 80)                        │    │
│  │         (Optional - not currently used)             │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Node.js Backend (Port 8000)                 │    │
│  │                                                      │    │
│  │  • Serves API endpoints                             │    │
│  │  • Serves built React frontend                      │    │
│  │  • Connects to MongoDB Atlas                        │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │        Frontend Build (Static Files)                │    │
│  │    /opt/expense-tracker/server/client/build/        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   MongoDB Atlas        │
              │   (Cloud Database)     │
              └────────────────────────┘
```

---

## How Ansible Works

### Basic Concepts

#### 1. **Inventory** (`inventory/production.yml`)
Defines **WHERE** to deploy (your servers)
```yaml
expense-tracker-1:
  ansible_host: 15.206.186.213  # Your AWS server IP
  ansible_user: ubuntu           # SSH user
  ansible_ssh_private_key_file: ~/.ssh/MyKeyPair.pem  # SSH key
```

#### 2. **Playbook** (`site.yml`)
Defines **WHAT** to do (the deployment steps)
```yaml
- hosts: expense_tracker
  roles:
    - common      # Install basic tools
    - mongo       # Setup MongoDB (if needed)
    - backend     # Deploy Node.js backend
    - frontend    # Build and deploy React frontend
```

#### 3. **Roles** (`roles/`)
Defines **HOW** to do it (detailed tasks)
- Each role is a collection of tasks
- Organized by component (frontend, backend, etc.)

#### 4. **Variables** (`inventory/group_vars/`)
Defines **CONFIGURATION** (settings)
- `all.yml` - Public configuration
- `all.vault.yml` - Encrypted secrets (passwords, API keys)

#### 5. **Templates** (`roles/*/templates/`)
Defines **CONFIGURATION FILES** that get generated
- `.env` files for backend
- `.env.production` for frontend
- Nginx config
- Systemd service files

---

## Your Deployment Structure

```
deploy/ansible/
├── ansible.cfg                    # Ansible configuration
├── site.yml                       # Main playbook (entry point)
│
├── inventory/
│   ├── production.yml            # Server details (IP, SSH key)
│   └── group_vars/
│       ├── all.yml               # Public variables
│       └── all.vault.yml         # Encrypted secrets (ENCRYPTED!)
│
└── roles/
    ├── common/                   # Basic server setup
    │   ├── tasks/main.yml       # Install Node.js, npm, git
    │   └── handlers/main.yml    # Restart services if needed
    │
    ├── mongo/                    # MongoDB setup (optional)
    │   └── tasks/main.yml       # Install MongoDB locally
    │
    ├── backend/                  # Backend deployment
    │   ├── tasks/main.yml       # Clone code, install deps, setup service
    │   ├── templates/
    │   │   ├── env.server.j2    # Backend .env template
    │   │   └── expense-tracker.service.j2  # Systemd service
    │   └── handlers/main.yml    # Restart backend service
    │
    └── frontend/                 # Frontend deployment
        ├── tasks/main.yml       # Build React app, setup Nginx
        ├── templates/
        │   ├── env.production.j2    # Frontend .env.production
        │   └── nginx.conf.j2        # Nginx configuration
        └── handlers/main.yml    # Reload Nginx
```

---

## Step-by-Step Deployment Process

### Phase 1: Preparation (On Your Local Machine)

#### Step 1: Configure Variables
```bash
# Edit public variables
notepad inventory/group_vars/all.yml
```
Contains:
- Server IP
- Repository URL
- Paths
- Port numbers

#### Step 2: Configure Secrets
```bash
# Edit encrypted secrets (requires vault password)
ansible-vault edit inventory/group_vars/all.vault.yml
```
Contains:
- MongoDB connection string
- JWT secret
- API keys
- Frontend API URL

**Important Variables:**
```yaml
vault_frontend_env:
  VITE_API_URL: http://15.206.186.213:8000  # ← This fixes your login issue!

vault_backend_env:
  PORT: 8000
  CLIENT_URL: http://15.206.186.213
  MONGO_URL: mongodb+srv://user:pass@cluster.mongodb.net/db
  JWT_SECRET: your-secret-key
```

### Phase 2: Run Ansible Playbook

#### Step 3: Execute Deployment
```bash
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

**What this command does:**
- `-i inventory/production.yml` - Use this inventory (server list)
- `site.yml` - Run this playbook
- `--ask-vault-pass` - Prompt for password to decrypt secrets

### Phase 3: What Happens on the Server

#### Step 4: Common Role Execution
```
┌─────────────────────────────────────────┐
│  1. Update apt packages                  │
│  2. Install Node.js 20.x                 │
│  3. Install npm                          │
│  4. Install git                          │
│  5. Install nginx                        │
│  6. Create app user (exptracker)         │
└─────────────────────────────────────────┘
```

**Actual Tasks:**
```yaml
- name: Update apt cache
  apt: update_cache=yes

- name: Install Node.js
  apt: name=nodejs state=present

- name: Create app user
  user: name=exptracker system=yes
```

#### Step 5: Backend Role Execution
```
┌─────────────────────────────────────────┐
│  1. Clone Git repository                 │
│     → /opt/expense-tracker/              │
│                                          │
│  2. Install backend dependencies         │
│     → npm install in server/             │
│                                          │
│  3. Create .env file from template       │
│     → Contains MONGO_URL, JWT_SECRET     │
│                                          │
│  4. Create systemd service               │
│     → expense-tracker.service            │
│                                          │
│  5. Start and enable service             │
│     → Backend runs on port 8000          │
└─────────────────────────────────────────┘
```

**Backend .env Template (`env.server.j2`):**
```bash
PORT={{ vault_backend_env.PORT }}
CLIENT_URL={{ vault_backend_env.CLIENT_URL }}
MONGO_URL={{ vault_backend_env.MONGO_URL }}
JWT_SECRET={{ vault_backend_env.JWT_SECRET }}
```

**Systemd Service Template:**
```ini
[Unit]
Description=Expense Tracker Backend
After=network.target

[Service]
Type=simple
User=exptracker
WorkingDirectory=/opt/expense-tracker/server
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Step 6: Frontend Role Execution
```
┌─────────────────────────────────────────┐
│  1. Navigate to frontend directory       │
│     → /opt/expense-tracker/client/       │
│       expense-tracker/                   │
│                                          │
│  2. Install frontend dependencies        │
│     → npm install                        │
│                                          │
│  3. Create .env.production file          │
│     → VITE_API_URL=http://IP:8000       │
│     ← THIS IS THE KEY FIX!               │
│                                          │
│  4. Build React application              │
│     → npm run build                      │
│     → Output: server/client/build/       │
│                                          │
│  5. Configure Nginx (optional)           │
│     → Setup reverse proxy                │
│                                          │
│  6. Restart services                     │
│     → Backend serves the built frontend  │
└─────────────────────────────────────────┘
```

**Frontend .env.production Template:**
```bash
VITE_API_URL={{ vault_frontend_env.VITE_API_URL }}
```

**Why This Matters:**
- Vite (React build tool) reads `VITE_API_URL` at **build time**
- It replaces `import.meta.env.VITE_API_URL` with the actual value
- The built JavaScript contains the hardcoded API URL
- If wrong, the frontend calls the wrong backend!

---

## What Happens Behind the Scenes

### 1. Ansible Connects to Server
```
Your Computer → SSH → AWS Server (15.206.186.213)
                ↑
            Uses MyKeyPair.pem
```

### 2. Ansible Runs Tasks
For each task, Ansible:
1. Generates the command/script
2. Copies it to the server
3. Executes it
4. Captures the output
5. Reports success/failure

### 3. Template Processing
When Ansible encounters a template (`.j2` file):
```
Template:          Variables:              Result:
---------          ----------              -------
PORT={{ port }}    port: 8000       →      PORT=8000
MONGO_URL={{       mongo_url:       →      MONGO_URL=mongodb+srv://
  mongo_url }}       mongodb+srv://...        user:pass@cluster...
```

### 4. Service Management
Ansible uses systemd to manage the backend:
```bash
# Start service
sudo systemctl start expense-tracker

# Enable on boot
sudo systemctl enable expense-tracker

# Check status
sudo systemctl status expense-tracker
```

### 5. File Permissions
Ansible ensures correct ownership:
```bash
# All files owned by exptracker user
sudo chown -R exptracker:exptracker /opt/expense-tracker
```

---

## Complete Deployment Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL MACHINE                             │
│                                                                   │
│  1. Edit inventory/group_vars/all.vault.yml                      │
│     • Set VITE_API_URL                                           │
│     • Set MONGO_URL, JWT_SECRET                                  │
│                                                                   │
│  2. Run: ansible-playbook -i inventory/production.yml site.yml   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ SSH Connection
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    AWS EC2 SERVER                                 │
│                                                                   │
│  COMMON ROLE:                                                     │
│  ├─ Install Node.js, npm, git, nginx                            │
│  └─ Create exptracker user                                       │
│                                                                   │
│  BACKEND ROLE:                                                    │
│  ├─ Clone repo from GitHub                                       │
│  ├─ cd /opt/expense-tracker/server                              │
│  ├─ npm install                                                  │
│  ├─ Create .env file:                                            │
│  │   PORT=8000                                                   │
│  │   MONGO_URL=mongodb+srv://...                                │
│  │   JWT_SECRET=...                                             │
│  ├─ Create systemd service                                       │
│  └─ Start backend service                                        │
│                                                                   │
│  FRONTEND ROLE:                                                   │
│  ├─ cd /opt/expense-tracker/client/expense-tracker              │
│  ├─ npm install                                                  │
│  ├─ Create .env.production:                                      │
│  │   VITE_API_URL=http://15.206.186.213:8000                   │
│  ├─ npm run build                                                │
│  │   → Builds to: /opt/expense-tracker/server/client/build/     │
│  └─ Restart backend (which now serves the frontend)             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    RUNNING APPLICATION                            │
│                                                                   │
│  Backend Service (systemd):                                       │
│  • Runs: node /opt/expense-tracker/server/server.js             │
│  • Listens on: 0.0.0.0:8000                                      │
│  • Serves API: /api/v1/*                                         │
│  • Serves Frontend: /* (from client/build/)                      │
│                                                                   │
│  Access: http://15.206.186.213:8000                              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Why Your Login Was Failing

### The Problem
```
Frontend (built with wrong URL)
    ↓
Tries to call: http://localhost:8000/api/v1/auth/login
    ↓
❌ FAILS - localhost doesn't exist in browser!
```

### The Fix
```
Frontend (built with correct URL)
    ↓
Tries to call: http://15.206.186.213:8000/api/v1/auth/login
    ↓
✅ SUCCESS - Reaches your AWS server!
```

### How Ansible Fixed It
1. Created `.env.production` with `VITE_API_URL=http://15.206.186.213:8000`
2. Ran `npm run build` which read this variable
3. Built JavaScript now contains the correct URL
4. Login works!

---

## Ansible Commands Reference

### View Encrypted Secrets
```bash
# From WSL or Linux
ansible-vault view inventory/group_vars/all.vault.yml
```

### Edit Encrypted Secrets
```bash
ansible-vault edit inventory/group_vars/all.vault.yml
```

### Run Full Deployment
```bash
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

### Run Specific Role Only
```bash
# Only deploy frontend
ansible-playbook -i inventory/production.yml site.yml --tags frontend --ask-vault-pass

# Only deploy backend
ansible-playbook -i inventory/production.yml site.yml --tags backend --ask-vault-pass
```

### Dry Run (Check what would change)
```bash
ansible-playbook -i inventory/production.yml site.yml --check --ask-vault-pass
```

### Verbose Output (for debugging)
```bash
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass -vvv
```

---

## Troubleshooting

### Issue: "Permission denied (publickey)"
**Cause:** SSH key not found or wrong path

**Fix:**
```bash
# Check if key exists
ls -la ~/.ssh/MyKeyPair.pem

# Fix permissions
chmod 400 ~/.ssh/MyKeyPair.pem

# Update inventory/production.yml with correct path
ansible_ssh_private_key_file: ~/.ssh/MyKeyPair.pem
```

### Issue: "Vault password incorrect"
**Cause:** Wrong password for encrypted vault file

**Fix:**
- Remember the password you used to encrypt
- Or recreate the vault file

### Issue: "npm run build fails"
**Cause:** Permission issues or missing dependencies

**Fix:**
```bash
# SSH to server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@15.206.186.213

# Fix permissions
sudo chown -R exptracker:exptracker /opt/expense-tracker

# Rebuild as correct user
sudo -u exptracker bash -c 'cd /opt/expense-tracker/client/expense-tracker && npm run build'
```

### Issue: "Backend not starting"
**Cause:** MongoDB connection or port already in use

**Fix:**
```bash
# Check backend logs
sudo journalctl -u expense-tracker -n 50

# Check if port 8000 is in use
sudo lsof -i :8000

# Restart service
sudo systemctl restart expense-tracker
```

---

## Best Practices

### 1. Always Use Vault for Secrets
```bash
# NEVER commit unencrypted secrets!
# Always encrypt sensitive data
ansible-vault encrypt inventory/group_vars/all.vault.yml
```

### 2. Test Before Deploying
```bash
# Dry run first
ansible-playbook -i inventory/production.yml site.yml --check
```

### 3. Keep Backups
```bash
# Backup vault file
cp inventory/group_vars/all.vault.yml inventory/group_vars/all.vault.yml.backup
```

### 4. Use Version Control
```bash
# Commit your Ansible code (but not secrets!)
git add deploy/ansible/
git commit -m "Update Ansible deployment"
```

### 5. Document Changes
Keep notes of:
- Vault password (securely!)
- Server IPs
- SSH key locations
- Any manual changes made

---

## Summary

### What Ansible Does for You
1. ✅ Installs all required software
2. ✅ Clones your code from GitHub
3. ✅ Configures environment variables
4. ✅ Builds the frontend with correct API URL
5. ✅ Sets up systemd service
6. ✅ Starts and monitors your application

### What You Need to Do
1. Configure variables (once)
2. Run one command: `ansible-playbook ...`
3. Wait for deployment to complete
4. Access your app!

### Key Takeaway
**Ansible = Infrastructure as Code**
- Repeatable deployments
- No manual steps
- Version controlled
- Easy to update and redeploy

---

## Next Steps

1. **Learn More:**
   - [Ansible Documentation](https://docs.ansible.com/)
   - [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)

2. **Improve Your Setup:**
   - Add SSL/HTTPS with Let's Encrypt
   - Set up CI/CD with GitHub Actions
   - Add monitoring and logging
   - Configure automatic backups

3. **Scale Your Application:**
   - Add more servers to inventory
   - Use load balancers
   - Implement blue-green deployments

---

## Questions?

If you need help:
1. Check the logs: `sudo journalctl -u expense-tracker -f`
2. Verify configuration: `cat /opt/expense-tracker/server/.env`
3. Test manually: `curl http://localhost:8000/`
4. Review Ansible output for errors

Happy Deploying! 🚀
