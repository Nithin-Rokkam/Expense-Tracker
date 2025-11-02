# Next Steps for Deployment

## ✅ Completed
- [x] EC2 instance IP configured: `13.232.32.147`
- [x] SSH key path fixed: `~/.ssh/MyKeyPair.pem`

## 🔧 Configuration Steps (Do These Now)

### Step 1: Verify SSH Key Location
Make sure your SSH key is actually at `~/.ssh/MyKeyPair.pem` (or `C:\Users\nithi\.ssh\MyKeyPair.pem` on Windows).

If it's in a different location, update line 11 in `inventory/production.yml`.

### Step 2: Update Repository URL
Edit `inventory/group_vars/all.yml`:
- Change line 2: `app_repo_url: https://github.com/your-user/expense-tracker.git`
  - Replace with your actual GitHub/GitLab repository URL
  - If using SSH: `app_repo_url: git@github.com:your-username/expense-tracker.git`

### Step 3: Update Domain Name
Edit `inventory/group_vars/all.yml`:
- Change line 13: `public_domain: expense.yourdomain.com`
  - Replace with your actual domain (or use the EC2 public IP like `13.232.32.147` for testing)

### Step 4: Configure Secrets in Vault
Edit `inventory/group_vars/all.vault.yml`:

**IMPORTANT:** Update these with your real values:

```yaml
vault_backend_env:
  MONGO_URL: mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expense
  JWT_SECRET: "your-long-random-secret-key-here"
  CLIENT_URL: "http://13.232.32.147"  # or your domain
  PORT: 5000

vault_frontend_env:
  VITE_API_URL: "http://13.232.32.147"  # or your domain
```

**Then encrypt it:**
```bash
cd deploy/ansible
ansible-vault encrypt inventory/group_vars/all.vault.yml
```
Enter a strong password when prompted. **Remember this password** - you'll need it each time you run the playbook.

### Step 5: Install Ansible Collections
```bash
cd deploy/ansible
ansible-galaxy collection install -r requirements.yml
```

### Step 6: Test SSH Connection
Verify you can connect to your EC2 instance:
```bash
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@13.232.32.147
```
(On Windows PowerShell, use: `ssh -i C:\Users\nithi\.ssh\MyKeyPair.pem ubuntu@13.232.32.147`)

If this fails, fix the key path or check your EC2 security group allows SSH (port 22) from your IP.

### Step 7: Run the Playbook (Dry Run First)
Test without making changes:
```bash
cd deploy/ansible
ansible-playbook site.yml --ask-vault-pass --check
```

Review the output. If it looks good, run for real:
```bash
ansible-playbook site.yml --ask-vault-pass
```

## 🔍 Troubleshooting

### If SSH fails:
- Check security group allows port 22 from your IP
- Verify key file permissions (should be readable only)
- Try using the full Windows path in `production.yml`

### If playbook fails:
- Check AWS security group allows ports: 22, 80, 443, 5000
- Verify your repository is accessible (not private or needs SSH keys on EC2)
- Check MongoDB Atlas allows connections from EC2 IP

### Common Issues:
1. **"Permission denied"** → Wrong SSH key or security group blocking SSH
2. **"Failed to clone repo"** → Repository URL wrong or needs authentication
3. **"MongoDB connection failed"** → Check MONGO_URL in vault and Atlas whitelist

## 📋 Quick Checklist Before Running

- [ ] SSH key exists at the specified path
- [ ] Repository URL updated in `all.yml`
- [ ] Domain/IP updated in `all.yml` and `all.vault.yml`
- [ ] Vault file encrypted with real secrets
- [ ] Ansible collections installed
- [ ] Can SSH to EC2 instance
- [ ] Security group allows ports 22, 80, 443, 5000
- [ ] MongoDB Atlas allows EC2 IP (if using Atlas)

## 🚀 After Successful Deployment

1. Verify application:
   - Visit: `http://13.232.32.147` (or your domain)
   - Check backend: `http://13.232.32.147:5000`

2. Check services on EC2:
   ```bash
   ssh -i ~/.ssh/MyKeyPair.pem ubuntu@13.232.32.147
   sudo systemctl status expense-tracker
   sudo journalctl -u expense-tracker -f
   ```

3. View logs:
   - Backend: `/var/log/expense-tracker.log`
   - Nginx: `/var/log/nginx/expense-tracker.access.log`

