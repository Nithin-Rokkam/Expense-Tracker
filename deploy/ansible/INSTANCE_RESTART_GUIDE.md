# AWS Instance Restart - Complete Guide

## 📋 What Happens When You Stop/Start AWS Instance

When you **stop and restart** your AWS EC2 instance:
- ✅ All your files remain intact
- ✅ All installed software remains
- ✅ Your application code is still there
- ❌ **PUBLIC IP ADDRESS CHANGES** ← This is the problem!

---

## 🎯 Quick Reference - What to Update

When IP changes from `OLD_IP` to `NEW_IP`, update these **3 locations**:

| File | What to Change | Location |
|------|----------------|----------|
| **production.yml** | `ansible_host: NEW_IP` | Line 8 |
| **all.yml** | `public_domain: NEW_IP` | Line 13 |
| **Server .env.production** | `VITE_API_URL=http://NEW_IP:8000` | On server |

Then **rebuild frontend** on the server.

---

## 🚀 Complete Step-by-Step Process

### **Step 1: Get Your New IP Address**

#### Option A: AWS Console
1. Go to **AWS Console** → **EC2** → **Instances**
2. Select your instance
3. Copy **Public IPv4 address**

#### Option B: From Server
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@OLD_IP
curl http://checkip.amazonaws.com
```

**Write down the new IP:** `_________________`

---

### **Step 2: Update Local Configuration Files**

#### 2.1 Update `production.yml`

**File:** `deploy/ansible/inventory/production.yml`

```yaml
# Line 8 - Change this:
ansible_host: 52.66.246.144  # OLD IP

# To this:
ansible_host: 65.2.123.158   # NEW IP
```

#### 2.2 Update `all.yml`

**File:** `deploy/ansible/inventory/group_vars/all.yml`

```yaml
# Line 13 - Change this:
public_domain: 52.66.246.144  # OLD IP

# To this:
public_domain: 65.2.123.158   # NEW IP
```

#### 2.3 Update Local `.env.production` (Optional)

**File:** `client/expense-tracker/.env.production`

```env
# Change this:
VITE_API_URL=http://52.66.246.144:8000

# To this:
VITE_API_URL=http://65.2.123.158:8000
```

**Note:** This is your local copy. The important one is on the server!

---

### **Step 3: Update Server Configuration**

Now you need to update the `.env.production` file **on the server** and rebuild.

#### Option A: Use PowerShell Script (Easiest)

```powershell
# 1. Update the script with new IP
# Edit fix-on-server.ps1, change line 3:
$SERVER = "ubuntu@65.2.123.158"  # NEW IP

# Also change line 18:
echo 'VITE_API_URL=http://65.2.123.158:8000'  # NEW IP

# 2. Run the script
.\fix-on-server.ps1
```

#### Option B: Manual SSH (More Control)

```bash
# 1. SSH to server with NEW IP
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@65.2.123.158

# 2. Navigate to frontend
cd /opt/expense-tracker/client/expense-tracker

# 3. Update .env.production
echo "VITE_API_URL=http://65.2.123.158:8000" | sudo tee .env.production

# 4. Verify it
cat .env.production

# 5. Fix permissions
sudo chown -R exptracker:exptracker /opt/expense-tracker

# 6. Rebuild frontend (CRITICAL!)
sudo -u exptracker npm run build

# 7. Restart backend
sudo systemctl restart expense-tracker

# 8. Check status
sudo systemctl status expense-tracker

# 9. Exit
exit
```

---

### **Step 4: Test Your Application**

1. **Open browser:** `http://65.2.123.158:8000` (NEW IP)

2. **Clear browser cache:**
   - Press `Ctrl + Shift + R` (hard refresh)
   - Or `Ctrl + Shift + Delete` → Clear cached files

3. **Open DevTools:**
   - Press `F12`
   - Go to **Network** tab

4. **Try to login/signup**

5. **Verify API calls:**
   - Should see: `POST http://65.2.123.158:8000/api/v1/auth/login`
   - If correct IP → ✅ Working!
   - If old IP → Clear cache again

---

## 📝 Quick Command Cheat Sheet

### Get New IP
```bash
curl http://checkip.amazonaws.com
```

### Update Server (All-in-One)
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@NEW_IP << 'EOF'
cd /opt/expense-tracker/client/expense-tracker
echo "VITE_API_URL=http://NEW_IP:8000" | sudo tee .env.production
sudo chown -R exptracker:exptracker /opt/expense-tracker
sudo -u exptracker npm run build
sudo systemctl restart expense-tracker
sudo systemctl status expense-tracker --no-pager
EOF
```

### Verify Fix
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@NEW_IP "grep -o 'http://[0-9.]*:8000' /opt/expense-tracker/server/client/build/assets/*.js | head -3"
```

---

## 🛡️ Prevent This Issue - Use Elastic IP

### Why Use Elastic IP?
- ✅ IP **never changes** when you stop/start
- ✅ **Free** when attached to running instance
- ✅ No need to reconfigure every time

### How to Set Up Elastic IP

#### Step 1: Allocate Elastic IP
1. **AWS Console** → **EC2** → **Elastic IPs**
2. Click **"Allocate Elastic IP address"**
3. Click **"Allocate"**
4. **Note the IP:** `_________________`

#### Step 2: Associate with Instance
1. Select the Elastic IP you just created
2. Click **Actions** → **"Associate Elastic IP address"**
3. Select your instance from dropdown
4. Click **"Associate"**

#### Step 3: Update Configuration (One Time)
Follow Steps 2-4 above, but use the **Elastic IP** instead.

**That's it!** Now your IP will never change. 🎉

---

## 🔄 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  AWS Instance Stopped & Restarted                           │
│  → New IP Assigned: 65.2.123.158                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Update Local Files                                 │
│  ├─ production.yml (ansible_host)                          │
│  ├─ all.yml (public_domain)                                │
│  └─ local .env.production (optional)                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Update Server                                      │
│  ├─ SSH to server with NEW IP                              │
│  ├─ Update .env.production on server                       │
│  ├─ Rebuild frontend (npm run build)                       │
│  └─ Restart backend service                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Test                                               │
│  ├─ Open http://NEW_IP:8000                                │
│  ├─ Clear browser cache                                    │
│  └─ Verify API calls use NEW IP                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    ✅ Working!
```

---

## ⚠️ Common Mistakes & Solutions

### Mistake 1: Forgot to Rebuild Frontend
**Symptom:** Still getting timeout errors  
**Solution:** Must run `npm run build` on server

### Mistake 2: Didn't Clear Browser Cache
**Symptom:** Browser still calls old IP  
**Solution:** Press `Ctrl + Shift + R` or use Incognito mode

### Mistake 3: Updated Local File Only
**Symptom:** Server still has old IP  
**Solution:** Must update `.env.production` **on the server**

### Mistake 4: Wrong Permissions
**Symptom:** Build fails with EACCES error  
**Solution:** Run `sudo chown -R exptracker:exptracker /opt/expense-tracker`

### Mistake 5: Forgot to Restart Service
**Symptom:** Changes don't take effect  
**Solution:** Run `sudo systemctl restart expense-tracker`

---

## 🎯 Checklist - Use This Every Time

When your AWS instance restarts:

- [ ] Get new IP from AWS Console
- [ ] Update `production.yml` (line 8)
- [ ] Update `all.yml` (line 13)
- [ ] SSH to server with NEW IP
- [ ] Update server `.env.production`
- [ ] Fix permissions (`chown`)
- [ ] Rebuild frontend (`npm run build`)
- [ ] Restart service (`systemctl restart`)
- [ ] Test in browser with NEW IP
- [ ] Clear browser cache
- [ ] Verify API calls use NEW IP

---

## 🚀 Automated Script

Save this as `quick-update.ps1`:

```powershell
# Quick IP Update Script
param([Parameter(Mandatory=$true)][string]$NewIP)

Write-Host "Updating to new IP: $NewIP" -ForegroundColor Cyan

# Update production.yml
(Get-Content inventory/production.yml) -replace 'ansible_host: .*', "ansible_host: $NewIP" | Set-Content inventory/production.yml

# Update all.yml
(Get-Content inventory/group_vars/all.yml) -replace 'public_domain: .*', "public_domain: $NewIP" | Set-Content inventory/group_vars/all.yml

Write-Host "Local files updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run these commands on server:" -ForegroundColor Yellow
Write-Host "  ssh -i ~/.ssh/MyKeyPair.pem ubuntu@$NewIP" -ForegroundColor White
Write-Host "  cd /opt/expense-tracker/client/expense-tracker" -ForegroundColor White
Write-Host "  echo 'VITE_API_URL=http://${NewIP}:8000' | sudo tee .env.production" -ForegroundColor White
Write-Host "  sudo chown -R exptracker:exptracker /opt/expense-tracker" -ForegroundColor White
Write-Host "  sudo -u exptracker npm run build" -ForegroundColor White
Write-Host "  sudo systemctl restart expense-tracker" -ForegroundColor White
```

**Usage:**
```powershell
.\quick-update.ps1 -NewIP "65.2.123.158"
```

---

## 📊 Time Estimates

| Task | Time |
|------|------|
| Get new IP | 1 min |
| Update local files | 2 min |
| SSH and update server | 1 min |
| Rebuild frontend | 30 sec |
| Test application | 2 min |
| **Total** | **~7 minutes** |

With Elastic IP: **0 minutes** (no changes needed!)

---

## 🆘 Troubleshooting

### Service Won't Start
```bash
sudo journalctl -u expense-tracker -n 50
```
Check logs for MongoDB connection or other errors.

### Build Fails
```bash
# Check Node.js version
node --version  # Should be v20.x

# Reinstall dependencies
cd /opt/expense-tracker/client/expense-tracker
sudo -u exptracker npm install
sudo -u exptracker npm run build
```

### Still Getting Timeout
1. Check what IP is in built JS:
   ```bash
   grep -o "http://[0-9.]*:8000" /opt/expense-tracker/server/client/build/assets/*.js
   ```
2. If wrong IP, rebuild wasn't successful
3. Clear browser cache completely
4. Try Incognito/Private window

---

## 📚 Related Documentation

- **AWS_IP_CHANGE_FIX.md** - Detailed IP change solutions
- **STEP_BY_STEP_GUIDE.md** - Full deployment guide
- **ANSIBLE_DEPLOYMENT_EXPLAINED.md** - How Ansible works
- **RUN_ANSIBLE_ON_WINDOWS.md** - Using Ansible on Windows

---

## 💡 Pro Tips

1. **Set up Elastic IP immediately** - Saves time in the long run
2. **Keep a note of your current IP** - Easier to track changes
3. **Use the PowerShell script** - Faster than manual steps
4. **Always clear browser cache** - Prevents confusion
5. **Check DevTools Network tab** - Confirms which IP is being called

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Service status shows "active (running)"
- ✅ `grep` shows NEW IP in built JavaScript
- ✅ Browser DevTools shows API calls to NEW IP
- ✅ Login/signup works without timeout
- ✅ No errors in browser console

---

## 🎓 Summary

**The Problem:** AWS changes your public IP when you stop/start the instance.

**The Solution:** Update 3 files and rebuild the frontend.

**The Prevention:** Use an Elastic IP so the IP never changes.

**Time Required:** 7 minutes (or 0 with Elastic IP).

---

**Keep this guide handy! Bookmark it for next time your instance restarts.** 🚀

**Last Updated:** November 8, 2025  
**Current IP:** 65.2.123.158
