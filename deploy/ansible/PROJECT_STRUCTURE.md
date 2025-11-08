# Ansible Deployment - Project Structure

## Overview
This directory contains everything needed to deploy the Expense Tracker application to AWS using Ansible.

---

## 📁 File Structure

```
deploy/ansible/
│
├── 📄 Core Ansible Files
│   ├── ansible.cfg              # Ansible configuration
│   ├── site.yml                 # Main playbook (entry point)
│   └── requirements.yml         # Ansible role dependencies
│
├── 📚 Documentation (READ THESE!)
│   ├── README.md                           # Quick start guide
│   ├── ANSIBLE_DEPLOYMENT_EXPLAINED.md     # Complete theory & concepts
│   ├── STEP_BY_STEP_GUIDE.md              # Practical step-by-step instructions
│   └── AWS_IP_CHANGE_FIX.md               # Fix for IP changes after restart
│
├── 🛠️ Utility Scripts
│   ├── fix-on-server.ps1        # Quick manual fix (SSH + rebuild)
│   ├── update-ip.ps1            # Update IP after AWS restart
│   ├── encrypt_vault.py         # Encrypt vault file
│   ├── view_vault.py            # View vault contents
│   ├── edit_vault.py            # Edit vault file
│   ├── encrypt-vault.sh         # Bash script to encrypt vault
│   └── test-connection.sh       # Test SSH connection
│
├── 📋 Inventory (Server Configuration)
│   ├── inventory/
│   │   ├── production.yml       # Server details (IP, SSH key)
│   │   └── group_vars/
│   │       ├── all.yml          # Public variables
│   │       └── all.vault.yml    # Encrypted secrets (MONGO_URL, JWT_SECRET, etc.)
│
└── 🎭 Roles (Deployment Tasks)
    ├── roles/
    │   ├── common/              # Install Node.js, npm, git, nginx
    │   ├── mongo/               # Setup MongoDB (optional)
    │   ├── backend/             # Deploy Node.js backend
    │   └── frontend/            # Build and deploy React frontend
```

---

## 📚 Documentation Guide

### Start Here
1. **README.md** - Quick overview and getting started
2. **STEP_BY_STEP_GUIDE.md** - Follow this for deployment
3. **ANSIBLE_DEPLOYMENT_EXPLAINED.md** - Deep dive into how it works
4. **AWS_IP_CHANGE_FIX.md** - Reference when IP changes

### When to Use Each Document

| Document | When to Use |
|----------|-------------|
| **README.md** | First time setup, quick reference |
| **STEP_BY_STEP_GUIDE.md** | Deploying the application |
| **ANSIBLE_DEPLOYMENT_EXPLAINED.md** | Understanding how Ansible works |
| **AWS_IP_CHANGE_FIX.md** | After stopping/starting AWS instance |

---

## 🛠️ Script Usage

### fix-on-server.ps1
**Purpose:** Quick manual fix without Ansible  
**When to use:** When Ansible isn't available or for quick fixes  
**Usage:**
```powershell
.\fix-on-server.ps1
```
**What it does:**
- SSHs to server
- Updates .env.production with correct API URL
- Rebuilds frontend
- Restarts backend service

### update-ip.ps1
**Purpose:** Update configuration files with new IP  
**When to use:** After AWS instance restart (IP changes)  
**Usage:**
```powershell
.\update-ip.ps1 -NewIP "52.66.246.144"
```
**What it does:**
- Updates inventory/production.yml
- Updates inventory/group_vars/all.yml
- Reminds you to update vault file

### encrypt_vault.py
**Purpose:** Encrypt the vault file  
**When to use:** After creating/editing vault file  
**Usage:**
```bash
python encrypt_vault.py
```

### view_vault.py
**Purpose:** View encrypted vault contents  
**When to use:** To check what's in the vault  
**Usage:**
```bash
python view_vault.py
```

### edit_vault.py
**Purpose:** Edit encrypted vault file  
**When to use:** To change secrets (MongoDB URL, JWT secret, etc.)  
**Usage:**
```bash
python edit_vault.py
```

---

## 🔑 Key Configuration Files

### inventory/production.yml
**Contains:** Server connection details
```yaml
ansible_host: 52.66.246.144              # Your server IP
ansible_user: ubuntu                      # SSH username
ansible_ssh_private_key_file: ~/.ssh/MyKeyPair.pem
```

### inventory/group_vars/all.yml
**Contains:** Public configuration
```yaml
app_repo_url: https://github.com/Nithin-Rokkam/MERN-PROJECT.git
deploy_root: /opt/expense-tracker
backend_port: 8000
public_domain: 52.66.246.144
```

### inventory/group_vars/all.vault.yml (ENCRYPTED)
**Contains:** Sensitive secrets
```yaml
vault_frontend_env:
  VITE_API_URL: http://52.66.246.144:8000

vault_backend_env:
  PORT: 8000
  CLIENT_URL: http://52.66.246.144
  MONGO_URL: mongodb+srv://...
  JWT_SECRET: your-secret-key
```

---

## 🚀 Common Tasks

### Deploy Application
```bash
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

### Update After IP Change
```powershell
# 1. Update config files
.\update-ip.ps1 -NewIP "NEW_IP_HERE"

# 2. Update vault (from WSL)
ansible-vault edit inventory/group_vars/all.vault.yml

# 3. Redeploy
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

### Quick Fix Without Ansible
```powershell
.\fix-on-server.ps1
```

### View Vault Contents
```bash
ansible-vault view inventory/group_vars/all.vault.yml
# OR
python view_vault.py
```

### Edit Vault
```bash
ansible-vault edit inventory/group_vars/all.vault.yml
# OR
python edit_vault.py
```

---

## 🎯 Current Configuration

**Server IP:** 52.66.246.144  
**Application URL:** http://52.66.246.144:8000  
**Backend Port:** 8000  
**Deploy Location:** /opt/expense-tracker  
**Service Name:** expense-tracker  

---

## 📝 Important Notes

### Security
- ✅ Vault file is encrypted (contains secrets)
- ✅ SSH key has correct permissions (400)
- ⚠️ Never commit unencrypted vault file to Git
- ⚠️ Keep vault password safe and secure

### AWS Instance
- ⚠️ Public IP changes when you stop/start instance
- ✅ Use Elastic IP to prevent IP changes (recommended)
- ✅ Ensure Security Group allows ports: 22, 80, 8000

### Deployment
- ✅ Always test with `--check` flag first (dry run)
- ✅ Keep vault password documented securely
- ✅ Backup vault file before major changes

---

## 🆘 Troubleshooting

### Issue: Can't connect to server
**Solution:** Check if IP changed, update configuration

### Issue: Login fails in application
**Solution:** Frontend has wrong API URL, rebuild with correct IP

### Issue: Vault password forgotten
**Solution:** Recreate vault file (see AWS_IP_CHANGE_FIX.md)

### Issue: Permission denied during build
**Solution:** Run `sudo chown -R exptracker:exptracker /opt/expense-tracker`

---

## 📞 Quick Reference

### Check Service Status
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@52.66.246.144 "sudo systemctl status expense-tracker"
```

### View Logs
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@52.66.246.144 "sudo journalctl -u expense-tracker -f"
```

### Restart Service
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@52.66.246.144 "sudo systemctl restart expense-tracker"
```

### Test Backend
```bash
curl http://52.66.246.144:8000/
```

---

## 🎓 Learning Resources

1. **Start with:** STEP_BY_STEP_GUIDE.md
2. **Understand theory:** ANSIBLE_DEPLOYMENT_EXPLAINED.md
3. **Handle IP changes:** AWS_IP_CHANGE_FIX.md
4. **Ansible docs:** https://docs.ansible.com/

---

## ✅ Checklist for New Deployment

- [ ] AWS EC2 instance running
- [ ] Security Group allows ports 22, 80, 8000
- [ ] SSH key in ~/.ssh/MyKeyPair.pem
- [ ] MongoDB Atlas connection string ready
- [ ] Vault file configured with correct values
- [ ] inventory/production.yml has correct IP
- [ ] Run deployment: `ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass`
- [ ] Test application: http://52.66.246.144:8000
- [ ] Set up Elastic IP (recommended)

---

**Last Updated:** November 2, 2025  
**Current IP:** 52.66.246.144  
**Status:** ✅ Production Ready
