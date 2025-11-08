# AWS Instance IP Change - Quick Fix Guide

## Problem
After stopping and restarting your AWS EC2 instance, the application stops working because **the public IP address changed**.

## Why This Happens
- AWS assigns a **dynamic public IP** to EC2 instances by default
- When you stop/start the instance, AWS releases the old IP and assigns a new one
- Your application is still configured with the old IP address

---

## Solution 1: Update Configuration with New IP (Quick Fix)

### Step 1: Find Your New IP Address

#### Option A: AWS Console
1. Go to AWS Console → EC2 → Instances
2. Select your instance
3. Look for **Public IPv4 address** in the details
4. Copy the new IP (e.g., `13.127.45.67`)

#### Option B: SSH and Check
```bash
# If you can still SSH (using the old key)
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@<OLD_IP>

# Once connected, get the new public IP
curl http://checkip.amazonaws.com
```

### Step 2: Update Ansible Configuration

#### 2.1 Update Inventory File
```bash
# Edit production.yml
notepad c:\Users\nithi\OneDrive\Desktop\CSE\Expense-Tracker\deploy\ansible\inventory\production.yml
```

Change:
```yaml
ansible_host: 15.206.186.213  # Old IP
```

To:
```yaml
ansible_host: <NEW_IP_HERE>   # New IP
```

#### 2.2 Update Public Variables
```bash
# Edit all.yml
notepad c:\Users\nithi\OneDrive\Desktop\CSE\Expense-Tracker\deploy\ansible\inventory\group_vars\all.yml
```

Change:
```yaml
public_domain: 15.206.186.213  # Old IP
```

To:
```yaml
public_domain: <NEW_IP_HERE>   # New IP
```

#### 2.3 Update Vault Secrets
```bash
# From WSL or Linux
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# Edit vault
ansible-vault edit inventory/group_vars/all.vault.yml
```

Change:
```yaml
vault_frontend_env:
  VITE_API_URL: http://15.206.186.213:8000  # Old IP

vault_backend_env:
  CLIENT_URL: http://15.206.186.213         # Old IP
```

To:
```yaml
vault_frontend_env:
  VITE_API_URL: http://<NEW_IP>:8000       # New IP

vault_backend_env:
  CLIENT_URL: http://<NEW_IP>              # New IP
```

Save and exit (`:wq`)

### Step 3: Redeploy with Ansible
```bash
# From WSL
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

# Run deployment with new IP
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

This will:
1. Connect to the new IP
2. Update `.env` files with new IP
3. Rebuild frontend with new API URL
4. Restart services

### Step 4: Test New URL
Open in browser: `http://<NEW_IP>:8000`

---

## Solution 2: Use Elastic IP (Permanent Fix)

An **Elastic IP** is a static IP that doesn't change when you stop/start the instance.

### Step 1: Allocate Elastic IP

1. Go to AWS Console → EC2 → **Elastic IPs** (left sidebar)
2. Click **Allocate Elastic IP address**
3. Click **Allocate**
4. Note the new Elastic IP (e.g., `52.66.123.45`)

### Step 2: Associate with Your Instance

1. Select the Elastic IP you just created
2. Click **Actions** → **Associate Elastic IP address**
3. Select your instance from dropdown
4. Click **Associate**

### Step 3: Update Configuration (One Time)

Now update your Ansible configuration with this Elastic IP (follow Solution 1 steps above).

### Benefits
- ✅ IP never changes, even after stop/start
- ✅ No need to reconfigure after restarts
- ✅ Can be moved between instances

### Cost
- **Free** if associated with a running instance
- **Small charge** (~$0.005/hour) if not associated with an instance

---

## Solution 3: Use Domain Name (Best Practice)

Instead of using IP addresses, use a domain name.

### Step 1: Get a Domain
- Buy from: Namecheap, GoDaddy, AWS Route 53
- Or use free: Freenom, No-IP

### Step 2: Point Domain to Your IP
Create an **A record**:
```
Type: A
Name: @ (or expense-tracker)
Value: <YOUR_ELASTIC_IP>
TTL: 300
```

### Step 3: Update Configuration
Use domain instead of IP:
```yaml
# all.yml
public_domain: expense-tracker.yourdomain.com

# all.vault.yml
vault_frontend_env:
  VITE_API_URL: http://expense-tracker.yourdomain.com:8000

vault_backend_env:
  CLIENT_URL: http://expense-tracker.yourdomain.com
```

### Step 4: Add SSL (Optional but Recommended)
```bash
# On server
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d expense-tracker.yourdomain.com
```

Now access via: `https://expense-tracker.yourdomain.com`

---

## Quick Manual Fix (If Ansible Not Available)

If you need to fix it quickly without Ansible:

### Step 1: SSH to Server (with new IP)
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@<NEW_IP>
```

### Step 2: Update Frontend Environment
```bash
cd /opt/expense-tracker/client/expense-tracker
echo "VITE_API_URL=http://<NEW_IP>:8000" | sudo tee .env.production
```

### Step 3: Update Backend Environment
```bash
sudo nano /opt/expense-tracker/server/.env
```

Change:
```
CLIENT_URL=http://<NEW_IP>
```

### Step 4: Rebuild Frontend
```bash
cd /opt/expense-tracker/client/expense-tracker
sudo -u exptracker npm run build
```

### Step 5: Restart Backend
```bash
sudo systemctl restart expense-tracker
```

### Step 6: Test
Open: `http://<NEW_IP>:8000`

---

## Prevention Checklist

To avoid this issue in the future:

- [ ] Use **Elastic IP** (recommended)
- [ ] Or use **Domain Name** (best practice)
- [ ] Document your current IP in a safe place
- [ ] Set up monitoring/alerts for IP changes
- [ ] Keep Ansible configuration in version control

---

## Comparison of Solutions

| Solution | Pros | Cons | Cost |
|----------|------|------|------|
| **Update Config** | Quick, simple | Need to redo after each restart | Free |
| **Elastic IP** | IP never changes | Need to remember to release when done | Free (when attached) |
| **Domain Name** | Professional, easy to remember | Requires domain purchase | $10-15/year |
| **Domain + SSL** | Secure, professional | More setup required | $10-15/year |

---

## Recommended Approach

### For Development/Testing:
Use **Elastic IP** - It's free and solves the problem permanently.

### For Production:
Use **Domain Name + SSL** - Professional and secure.

---

## Step-by-Step: Elastic IP Setup (Recommended)

### 1. Allocate Elastic IP
```
AWS Console → EC2 → Elastic IPs → Allocate Elastic IP address
```

### 2. Associate with Instance
```
Select Elastic IP → Actions → Associate Elastic IP address → Select Instance
```

### 3. Update Ansible Files

**inventory/production.yml:**
```yaml
ansible_host: <ELASTIC_IP>
```

**inventory/group_vars/all.yml:**
```yaml
public_domain: <ELASTIC_IP>
```

**inventory/group_vars/all.vault.yml:**
```yaml
vault_frontend_env:
  VITE_API_URL: http://<ELASTIC_IP>:8000

vault_backend_env:
  CLIENT_URL: http://<ELASTIC_IP>
```

### 4. Redeploy
```bash
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass
```

### 5. Done!
Now you can stop/start your instance anytime without IP changes.

---

## Troubleshooting

### Can't SSH with New IP
**Problem:** `ssh: connect to host <NEW_IP> port 22: Connection refused`

**Solution:**
1. Wait 2-3 minutes after starting instance
2. Check Security Group allows SSH (port 22) from your IP
3. Verify instance is running in AWS Console

### Application Still Shows Old IP
**Problem:** Frontend still tries to call old IP

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Verify `.env.production` has new IP
4. Verify frontend was rebuilt after changing `.env.production`

### Elastic IP Not Working
**Problem:** Can't access instance via Elastic IP

**Solution:**
1. Verify Elastic IP is associated with instance
2. Check Security Group rules
3. Wait 2-3 minutes for DNS propagation
4. Try accessing via: `http://<ELASTIC_IP>:8000`

---

## Summary

### What Happened
```
Stop Instance → AWS releases old IP → Start Instance → AWS assigns new IP
```

### What to Do
```
Get new IP → Update Ansible config → Redeploy → Works again!
```

### Best Solution
```
Allocate Elastic IP → Associate with instance → Never worry about IP changes again!
```

---

## Quick Commands Reference

```bash
# Find new IP from server
curl http://checkip.amazonaws.com

# Update and redeploy (from WSL)
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
ansible-vault edit inventory/group_vars/all.vault.yml
# Update IPs, save and exit
ansible-playbook -i inventory/production.yml site.yml --ask-vault-pass

# Manual fix on server
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@<NEW_IP>
echo "VITE_API_URL=http://<NEW_IP>:8000" | sudo tee /opt/expense-tracker/client/expense-tracker/.env.production
cd /opt/expense-tracker/client/expense-tracker && sudo -u exptracker npm run build
sudo systemctl restart expense-tracker
```

---

**Recommendation:** Set up an Elastic IP now to avoid this issue in the future! It takes 5 minutes and is free.
