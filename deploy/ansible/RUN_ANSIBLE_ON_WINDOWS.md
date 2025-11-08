# How to Run Ansible on Windows

## The Problem
Ansible doesn't work natively on Windows PowerShell. You'll get this error:
```
AttributeError: module 'os' has no attribute 'get_blocking'
```

## The Solution: Use WSL (Windows Subsystem for Linux)

---

## Option 1: Use WSL (Recommended)

### Step 1: Check if WSL is Installed
```powershell
wsl --version
```

If you see version info, WSL is installed. Skip to Step 3.

### Step 2: Install WSL (if needed)
```powershell
# In PowerShell (Admin)
wsl --install
```

Then **restart your computer**.

### Step 3: Open WSL
```powershell
wsl
```

You should see a Linux terminal (Ubuntu).

### Step 4: Install Ansible in WSL
```bash
# Update package list
sudo apt update

# Install Ansible
sudo apt install ansible -y

# Verify installation
ansible --version
```

### Step 5: Navigate to Your Project
```bash
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
```

**Note:** Windows drives are mounted under `/mnt/` in WSL:
- `C:\` becomes `/mnt/c/`
- `D:\` becomes `/mnt/d/`

### Step 6: Run Ansible Commands
```bash
# Now you can run Ansible commands
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

---

## Option 2: Use the PowerShell Fix Script (Quick Alternative)

If you don't want to use WSL, use the fix script we created:

```powershell
.\fix-on-server.ps1
```

This script:
- SSHs directly to your server
- Updates configuration
- Rebuilds frontend
- Restarts services

**No Ansible needed!**

---

## Complete WSL Workflow

### First Time Setup
```powershell
# 1. Open PowerShell
wsl

# 2. Install Ansible (one time only)
sudo apt update && sudo apt install ansible -y

# 3. Navigate to project
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
```

### Every Time You Deploy
```bash
# 1. Open WSL
wsl

# 2. Navigate to project
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# 3. Edit vault (if needed)
ansible-vault edit inventory/group_vars/all.vault.yml

# 4. Run deployment
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

---

## Quick Reference

### Open WSL
```powershell
wsl
```

### Exit WSL (back to PowerShell)
```bash
exit
```

### Access Windows files from WSL
```bash
# Windows C:\ drive
cd /mnt/c/

# Your project
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
```

### Run Ansible Commands
```bash
# View vault
ansible-vault view inventory/group_vars/all.vault.yml

# Edit vault
ansible-vault edit inventory/group_vars/all.vault.yml

# Deploy
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass

# Dry run (test without changes)
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass --check
```

---

## Troubleshooting

### Issue: "wsl: command not found"
**Solution:** WSL is not installed. Run:
```powershell
wsl --install
```
Then restart your computer.

### Issue: "ansible: command not found" in WSL
**Solution:** Ansible is not installed in WSL. Run:
```bash
sudo apt update
sudo apt install ansible -y
```

### Issue: Can't find project files in WSL
**Solution:** Remember to use `/mnt/c/` prefix:
```bash
# Wrong
cd C:\Users\nithi\...

# Correct
cd /mnt/c/Users/nithi/...
```

### Issue: Permission denied when editing vault
**Solution:** Make sure you're in the correct directory:
```bash
pwd  # Check current directory
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
```

---

## Why Ansible Doesn't Work on Windows

Ansible is built for Unix-like systems (Linux, macOS) and uses:
- Unix system calls (`os.get_blocking`)
- SSH connections
- Bash scripts

Windows PowerShell doesn't have these features natively, which is why you need WSL.

---

## Alternative: Use Docker (Advanced)

If you don't want to use WSL, you can run Ansible in Docker:

```powershell
docker run -it --rm -v ${PWD}:/ansible ansible/ansible:latest ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

But WSL is simpler and recommended.

---

## Summary

| Method | Pros | Cons |
|--------|------|------|
| **WSL** | Full Ansible support, native Linux | Requires WSL installation |
| **fix-on-server.ps1** | Works on Windows, no Ansible needed | Manual, not automated |
| **Docker** | Isolated environment | Complex setup |

**Recommendation:** Use WSL for proper Ansible deployment.

---

## Your Next Steps

1. **Open WSL:**
   ```powershell
   wsl
   ```

2. **Install Ansible (if not installed):**
   ```bash
   sudo apt update && sudo apt install ansible -y
   ```

3. **Navigate to project:**
   ```bash
   cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
   ```

4. **Run deployment:**
   ```bash
   ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
   ```

That's it! 🚀
