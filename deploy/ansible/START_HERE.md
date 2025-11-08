# 🚀 START HERE - Quick Reference

## Your Application

**Current IP:** `65.2.123.158`  
**Application URL:** `http://65.2.123.158:8000`  
**Last Updated:** November 8, 2025

---

## ⚡ When AWS Instance Restarts (Most Common Issue)

### Problem
Your IP address changed, and login shows "Request timeout" error.

### Solution (2 minutes)
```powershell
# 1. Get new IP from AWS Console

# 2. Update local files
.\quick-update.ps1 -NewIP "NEW_IP_HERE"

# 3. Fix server
.\fix-on-server.ps1

# 4. Test at http://NEW_IP:8000
```

**Detailed Guide:** `INSTANCE_RESTART_GUIDE.md`

---

## 📚 Documentation Quick Links

| When You Need... | Read This |
|------------------|-----------|
| 🔄 **Instance restarted (IP changed)** | `INSTANCE_RESTART_GUIDE.md` |
| 🎓 **Understand how Ansible works** | `ANSIBLE_DEPLOYMENT_EXPLAINED.md` |
| 📖 **Step-by-step deployment** | `STEP_BY_STEP_GUIDE.md` |
| 💻 **Run Ansible on Windows** | `RUN_ANSIBLE_ON_WINDOWS.md` |
| 🔧 **Fix IP change issues** | `AWS_IP_CHANGE_FIX.md` |
| 📁 **See project structure** | `PROJECT_STRUCTURE.md` |
| 📋 **Quick overview** | `README.md` |

---

## 🛠️ Available Scripts

### quick-update.ps1
Updates all configuration files with new IP.
```powershell
.\quick-update.ps1 -NewIP "65.2.123.158"
```

### fix-on-server.ps1
SSHs to server, rebuilds frontend, restarts service.
```powershell
.\fix-on-server.ps1
```

### update-ip.ps1
Updates only inventory files (production.yml, all.yml).
```powershell
.\update-ip.ps1 -NewIP "65.2.123.158"
```

### run-ansible.ps1
Opens WSL with Ansible commands ready.
```powershell
.\run-ansible.ps1
```

---

## 🎯 Common Tasks

### Check if Service is Running
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158 "sudo systemctl status expense-tracker"
```

### View Live Logs
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158 "sudo journalctl -u expense-tracker -f"
```

### Restart Service
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158 "sudo systemctl restart expense-tracker"
```

### Test Backend API
```bash
curl http://65.2.123.158:8000/
```

---

## 🆘 Quick Troubleshooting

### Login shows "Request timeout"
**Cause:** IP changed, frontend calling old IP  
**Fix:** Run `.\fix-on-server.ps1` and clear browser cache (Ctrl+Shift+R)

### "Ansible doesn't work on Windows"
**Cause:** Ansible needs Linux  
**Fix:** Use WSL - run `wsl` then Ansible commands

### Service won't start
**Check logs:**
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158 "sudo journalctl -u expense-tracker -n 50"
```

### Build fails with permission error
**Fix:**
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158 "sudo chown -R exptracker:exptracker /opt/expense-tracker"
```

---

## 🛡️ Prevent IP Changes Forever

**Set up Elastic IP (5 minutes, free):**

1. AWS Console → EC2 → Elastic IPs
2. Click "Allocate Elastic IP address"
3. Click "Allocate"
4. Select IP → Actions → "Associate Elastic IP address"
5. Choose your instance → Associate
6. Update configuration with Elastic IP (one time)

**Benefits:**
- ✅ IP never changes
- ✅ Free when attached to instance
- ✅ No more configuration updates

See `INSTANCE_RESTART_GUIDE.md` for details.

---

## 📊 Project Files Overview

```
deploy/ansible/
├── 📖 Documentation
│   ├── START_HERE.md                    ← You are here
│   ├── INSTANCE_RESTART_GUIDE.md        ← Read when IP changes
│   ├── ANSIBLE_DEPLOYMENT_EXPLAINED.md  ← Theory
│   ├── STEP_BY_STEP_GUIDE.md           ← Practical guide
│   ├── RUN_ANSIBLE_ON_WINDOWS.md       ← WSL setup
│   ├── AWS_IP_CHANGE_FIX.md            ← IP solutions
│   ├── PROJECT_STRUCTURE.md            ← File structure
│   └── README.md                        ← Overview
│
├── 🛠️ Scripts
│   ├── quick-update.ps1                 ← Update all files
│   ├── fix-on-server.ps1               ← Quick fix
│   ├── update-ip.ps1                   ← Update inventory
│   └── run-ansible.ps1                 ← WSL helper
│
├── ⚙️ Ansible Configuration
│   ├── site.yml                        ← Main playbook
│   ├── ansible.cfg                     ← Config
│   ├── inventory/                      ← Server details
│   └── roles/                          ← Deployment tasks
```

---

## ✅ Quick Checklist

When your AWS instance restarts:

- [ ] Get new IP from AWS Console
- [ ] Run `.\quick-update.ps1 -NewIP "NEW_IP"`
- [ ] Run `.\fix-on-server.ps1`
- [ ] Open `http://NEW_IP:8000` in browser
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Test login/signup
- [ ] Verify API calls go to new IP (F12 → Network tab)

---

## 🎓 Learning Path

**New to this project?**

1. Read `README.md` - Overview
2. Read `ANSIBLE_DEPLOYMENT_EXPLAINED.md` - Understand the system
3. Read `STEP_BY_STEP_GUIDE.md` - Learn deployment process
4. Bookmark `INSTANCE_RESTART_GUIDE.md` - For when IP changes

**Just need to fix something?**

- IP changed? → `INSTANCE_RESTART_GUIDE.md`
- Login broken? → Run `.\fix-on-server.ps1`
- Ansible error? → `RUN_ANSIBLE_ON_WINDOWS.md`

---

## 💡 Pro Tips

1. **Set up Elastic IP immediately** - Saves hours of work
2. **Bookmark this file** - Quick reference for common tasks
3. **Keep vault password safe** - Write it down securely
4. **Clear browser cache** - Always after rebuilding frontend
5. **Check DevTools Network tab** - Confirms which IP is being called

---

## 🎯 Most Common Workflow

```
AWS Instance Restarts
        ↓
IP Changes (e.g., 52.66.246.144 → 65.2.123.158)
        ↓
Run: .\quick-update.ps1 -NewIP "65.2.123.158"
        ↓
Run: .\fix-on-server.ps1
        ↓
Test: http://65.2.123.158:8000
        ↓
Clear browser cache (Ctrl+Shift+R)
        ↓
✅ Working!
```

---

## 📞 Need Help?

1. **Check documentation** - See links above
2. **Check logs** - `sudo journalctl -u expense-tracker -n 50`
3. **Verify configuration** - Files in `inventory/`
4. **Test manually** - SSH to server and check files

---

**Remember:** Most issues are caused by IP changes. Use `INSTANCE_RESTART_GUIDE.md` as your go-to reference! 🚀

**Last Updated:** November 8, 2025  
**Current IP:** 65.2.123.158  
**Status:** ✅ Ready to use
