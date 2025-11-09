# Expense Tracker Ansible Deployment

This directory contains Ansible playbooks and scripts to deploy the Expense Tracker application to AWS EC2.

**Current Status:**
- Server IP: `3.110.163.190`
- Application URL: `http://3.110.163.190:8000`
- Security: ✅ Enabled (Firewall, Fail2Ban, SSH Hardening)
- Monitoring: ✅ Enabled (Health checks, System monitoring)
- Backups: ✅ Automated (Daily & Weekly)
- Last Updated: November 9, 2025

## Prerequisites

- AWS account with permissions to create EC2 instances, security groups, and IAM roles.
- AWS CLI v2 installed and configured (`aws configure`).
- Ansible >= 2.16 installed locally.
- SSH key pair named `expense-tracker-key` stored at `~/.ssh/expense-tracker-key.pem`.
- Application code pushed to a Git repository accessible from the EC2 host.

Install required collections:

```bash
ansible-galaxy collection install community.general amazon.aws
```

## Directory Layout

- `site.yml` – entry point playbook.
- `inventory/production.yml` – define target hosts.
- `inventory/group_vars/all.yml` – shared variables.
- `inventory/group_vars/all.vault.yml` – **encrypt with Ansible Vault**; holds secrets.
- `roles/common` – base packages, firewall, Node.js.
- `roles/backend` – clones repo, renders `.env`, configures systemd service.
- `roles/frontend` – builds React app, deploys Nginx site, writes `.env.production`.
- `roles/mongo` – optional self-hosted MongoDB installation.

## Preparing Secrets

Edit `inventory/group_vars/all.vault.yml` and encrypt it:

```bash
cd deploy/ansible
ansible-vault encrypt inventory/group_vars/all.vault.yml
```

When prompted, enter a strong vault password. To update later:

```bash
ansible-vault edit inventory/group_vars/all.vault.yml
```

Example secret values:

```yaml
vault_backend_env:
  MONGO_URL: mongodb+srv://<user>:<pass>@cluster/expense
  JWT_SECRET: "replace-me"
  CLIENT_URL: https://expense.example.com
  PORT: 5000

vault_frontend_env:
  VITE_API_URL: https://expense.example.com
```

## Inventory

Update `inventory/production.yml` with your EC2 public IP or hostname.

```yaml
expense-tracker-1:
  ansible_host: 3.92.10.50
```

For dynamic inventory, you can replace the file with the `amazon.aws.aws_ec2` plugin.

## Running the Playbook

```bash
cd deploy/ansible
ansible-playbook site.yml --ask-vault-pass
```

Use `--check --diff` for a dry run. Re-run the play whenever config changes; tasks are idempotent.

## AWS Provisioning Cheat Sheet

1. Create security group, key pair, and optional IAM instance profile.
2. Launch Ubuntu 22.04 instance (t3.small recommended for starter).
3. Record the public IP for the inventory.
4. Open ports 22, 80, 443, and the backend port (5000 by default).

Sample commands:

```bash
aws ec2 create-security-group --group-name expense-tracker-sg --description "Expense Tracker"
aws ec2 authorize-security-group-ingress --group-name expense-tracker-sg --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 run-instances --image-id <AMI> --instance-type t3.small --key-name expense-tracker-key --security-groups expense-tracker-sg
```

## Manual Follow-ups

- Add DNS record pointing to the EC2 instance.
- Optionally enable HTTPS (e.g., using Certbot or an AWS Load Balancer).
- Monitor services with `systemctl status expense-tracker` and `journalctl -u expense-tracker -f`.
- Regularly rotate secrets and update via Vault.

---

## 🚀 Quick Start Guides

### Security & Monitoring (NEW!)
**Read:** `SECURITY_MONITORING_GUIDE.md` - Complete security & monitoring guide

**Deploy Security & Monitoring:**
```bash
# From WSL
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
./deploy-security-monitoring.sh
```

**Features Included:**
- 🔒 UFW Firewall
- 🛡️ Fail2Ban (brute-force protection)
- 🔐 SSH Hardening
- 📊 Health monitoring (auto-restart)
- 💾 Automated backups
- 📝 Log management

### When AWS Instance Restarts (IP Changes)
**Read:** `INSTANCE_RESTART_GUIDE.md` - Complete step-by-step guide

**Quick Fix:**
```powershell
# Update local files
.\quick-update.ps1 -NewIP "NEW_IP_HERE"

# Fix server
.\fix-on-server.ps1
```

### Understanding Ansible Deployment
- **ANSIBLE_DEPLOYMENT_EXPLAINED.md** - How everything works
- **STEP_BY_STEP_GUIDE.md** - Detailed deployment instructions
- **RUN_ANSIBLE_ON_WINDOWS.md** - Using Ansible on Windows (WSL)
- **SECURITY_MONITORING_GUIDE.md** - Security & monitoring features

### Available Scripts
- `fix-on-server.ps1` - Quick fix for IP changes (PowerShell)
- `quick-update.ps1` - Update all config files with new IP
- `update-ip.ps1` - Update inventory files only
- `run-ansible.ps1` - Helper to run Ansible in WSL
- `deploy-security-monitoring.sh` - Deploy security & monitoring (Bash)

---

## 📋 File Structure

```
deploy/ansible/
├── README.md                          # This file
├── INSTANCE_RESTART_GUIDE.md         # ⭐ Read this when IP changes
├── ANSIBLE_DEPLOYMENT_EXPLAINED.md    # Theory and concepts
├── STEP_BY_STEP_GUIDE.md             # Practical guide
├── RUN_ANSIBLE_ON_WINDOWS.md         # WSL setup
├── AWS_IP_CHANGE_FIX.md              # IP change solutions
├── PROJECT_STRUCTURE.md              # Project overview
│
├── site.yml                          # Main playbook
├── ansible.cfg                       # Ansible configuration
│
├── inventory/
│   ├── production.yml                # Server details
│   └── group_vars/
│       ├── all.yml                   # Public variables
│       └── all.vault.yml             # Encrypted secrets
│
├── roles/                            # Ansible roles
│   ├── common/                       # Base setup
│   ├── mongo/                        # MongoDB (optional)
│   ├── backend/                      # Backend deployment
│   └── frontend/                     # Frontend build
│
└── Scripts/
    ├── fix-on-server.ps1             # Quick fix script
    ├── quick-update.ps1              # Update all files
    ├── update-ip.ps1                 # Update inventory
    └── run-ansible.ps1               # WSL helper
```

---

## ⚡ Common Tasks

### After AWS Instance Restart
```powershell
# Get new IP from AWS Console, then:
.\quick-update.ps1 -NewIP "65.2.123.158"
.\fix-on-server.ps1
```

### Deploy with Ansible (from WSL)
```bash
wsl
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

### Check Service Status
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158 "sudo systemctl status expense-tracker"
```

### View Logs
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158 "sudo journalctl -u expense-tracker -f"
```

---

## 🛡️ Prevent IP Changes - Use Elastic IP

1. AWS Console → EC2 → Elastic IPs
2. Allocate Elastic IP address
3. Associate with your instance
4. Update configuration once with Elastic IP
5. Never worry about IP changes again!

See `INSTANCE_RESTART_GUIDE.md` for details.

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| **INSTANCE_RESTART_GUIDE.md** | What to do when AWS instance restarts |
| **ANSIBLE_DEPLOYMENT_EXPLAINED.md** | Complete theory and architecture |
| **STEP_BY_STEP_GUIDE.md** | Practical deployment walkthrough |
| **RUN_ANSIBLE_ON_WINDOWS.md** | How to use Ansible on Windows |
| **AWS_IP_CHANGE_FIX.md** | Solutions for IP change issues |
| **PROJECT_STRUCTURE.md** | File structure overview |

---

## 🆘 Troubleshooting

### Login Timeout Error
**Cause:** Frontend calling wrong IP  
**Fix:** Run `.\fix-on-server.ps1` and clear browser cache

### Ansible Won't Run on Windows
**Cause:** Ansible doesn't work natively on Windows  
**Fix:** Use WSL - see `RUN_ANSIBLE_ON_WINDOWS.md`

### Service Won't Start
**Check logs:**
```bash
sudo journalctl -u expense-tracker -n 50
```

### Build Fails
**Fix permissions:**
```bash
sudo chown -R exptracker:exptracker /opt/expense-tracker
```

---

**For detailed help, see `INSTANCE_RESTART_GUIDE.md`** 🚀
