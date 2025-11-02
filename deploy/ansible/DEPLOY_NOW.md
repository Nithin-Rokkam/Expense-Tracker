# Ready to Deploy! 🚀

## ✅ Completed Steps
- [x] Vault file encrypted successfully
- [x] Ansible collections installed (via WSL)
- [x] Configuration files updated with your values

## ⚠️ Important: SSH Key Setup

**You need to place your SSH key file at:**
```
C:\Users\nithi\.ssh\MyKeyPair.pem
```

### If you don't have the key:
1. **Download from AWS Console:**
   - Go to EC2 → Key Pairs
   - If `MyKeyPair` exists, download it
   - **Note:** If it was created via AWS CLI, you can't download it again

2. **Or create a new key pair:**
   ```powershell
   aws ec2 create-key-pair --key-name MyKeyPair --query 'KeyMaterial' --output text > C:\Users\nithi\.ssh\MyKeyPair.pem
   ```
   Then update your EC2 instance to use this new key pair.

3. **Or use an existing key:**
   - If you have the key elsewhere, copy it to `C:\Users\nithi\.ssh\MyKeyPair.pem`
   - Make sure permissions are set: `icacls C:\Users\nithi\.ssh\MyKeyPair.pem /inheritance:r /grant:r "%username%:R"`

## 🚀 Run the Deployment

Once your SSH key is in place, run the playbook **from WSL**:

```bash
wsl
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
ansible-playbook site.yml --ask-vault-pass
```

### What will happen:
1. Connects to EC2 instance (13.232.32.147)
2. Installs Node.js, Nginx, and dependencies
3. Clones your repository from GitHub
4. Builds the frontend
5. Configures the backend service
6. Sets up Nginx reverse proxy
7. Starts all services

### During execution:
- You'll be prompted for the **vault password** (the one you set when encrypting)
- The playbook will take 5-10 minutes
- Watch for any errors

## 🔍 After Deployment

Once successful, your app will be available at:
- **Frontend:** http://13.232.32.147
- **Backend API:** http://13.232.32.147:8000

### Check services on EC2:
```powershell
ssh -i C:\Users\nithi\.ssh\MyKeyPair.pem ubuntu@13.232.32.147
sudo systemctl status expense-tracker
sudo journalctl -u expense-tracker -f
```

## 🆘 Troubleshooting

### If SSH connection fails:
- Verify key file exists and is readable
- Check EC2 security group allows port 22 from your IP
- Try: `ssh -v -i C:\Users\nithi\.ssh\MyKeyPair.pem ubuntu@13.232.32.147`

### If playbook fails:
- Check the error message
- Common issues:
  - MongoDB Atlas needs to allow EC2 IP (13.232.32.147)
  - Security group needs ports: 22, 80, 443, 8000
  - Repository must be accessible (public or with SSH keys)

### To re-run playbook:
```bash
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
ansible-playbook site.yml --ask-vault-pass
```

The playbook is **idempotent** - safe to run multiple times!

---

**Ready when your SSH key is in place!** 🔑

