# Simple Step-by-Step Deployment Guide

## ✅ Already Done Automatically
- [x] Repository URL updated to: `https://github.com/Nithin-Rokkam/MERN-PROJECT.git`
- [x] Domain set to your EC2 IP: `13.232.32.147`
- [x] SSH key path configured

## 🔑 Step 1: Update MongoDB Connection String

**You need to provide your MongoDB connection string.** 

Open the file: `deploy/ansible/inventory/group_vars/all.vault.yml`

Find this line (around line 4):
```yaml
MONGO_URL: mongodb+srv://username:password@cluster/expense
```

Replace it with your actual MongoDB Atlas connection string. It should look like:
```yaml
MONGO_URL: mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expense
```

## 🔐 Step 2: Generate a JWT Secret

You need a random secret key for JWT. Let's generate one:

**On Windows PowerShell, run:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | % {[char]$_})
```

Copy the output and replace line 5 in `all.vault.yml`:
```yaml
JWT_SECRET: "paste-your-generated-secret-here"
```

## 🔒 Step 3: Encrypt the Secrets File

After updating the MongoDB URL and JWT secret, encrypt the file:

```powershell
cd deploy\ansible
ansible-vault encrypt inventory\group_vars\all.vault.yml
```

**Enter a strong password** when prompted. You'll need this password every time you run the playbook.

## 📦 Step 4: Install Ansible Collections

```powershell
cd deploy\ansible
ansible-galaxy collection install -r requirements.yml
```

## ✅ Step 5: Test SSH Connection

Verify you can connect to your EC2 instance:

```powershell
ssh -i C:\Users\nithi\.ssh\MyKeyPair.pem ubuntu@13.232.32.147
```

If it connects successfully, type `exit` to return.

**If it fails:**
- Check the key file exists at `C:\Users\nithi\.ssh\MyKeyPair.pem`
- Verify your EC2 security group allows SSH (port 22) from your IP

## 🧪 Step 6: Test the Playbook (Dry Run)

Before deploying for real, test what would happen:

```powershell
cd deploy\ansible
ansible-playbook site.yml --ask-vault-pass --check
```

Review the output. If everything looks good (no errors), proceed to Step 7.

## 🚀 Step 7: Deploy!

Run the actual deployment:

```powershell
cd deploy\ansible
ansible-playbook site.yml --ask-vault-pass
```

This will take 5-10 minutes. It will:
1. Install Node.js, Nginx, and dependencies
2. Clone your repository
3. Build your frontend
4. Configure and start the backend service
5. Set up Nginx as a reverse proxy

## 🎉 Step 8: Verify Deployment

Once done, visit in your browser:
- **Frontend:** http://13.232.32.147
- **Backend API:** http://13.232.32.147:5000

## 🆘 Troubleshooting

### If playbook fails:
- Check the error message - it will tell you what went wrong
- Common issues:
  - MongoDB connection: Make sure your Atlas cluster allows connections from EC2 IP `13.232.32.147`
  - Repository access: Your repo should be public or you need SSH keys set up on EC2
  - Security group: Ensure ports 22, 80, 443, 5000 are open

### To view logs on EC2:
```powershell
ssh -i C:\Users\nithi\.ssh\MyKeyPair.pem ubuntu@13.232.32.147
sudo journalctl -u expense-tracker -f
```

## 📋 Quick Checklist

Before running Step 7, make sure:
- [ ] MongoDB connection string updated in `all.vault.yml`
- [ ] JWT secret generated and updated in `all.vault.yml`
- [ ] Vault file encrypted (`ansible-vault encrypt`)
- [ ] Ansible collections installed
- [ ] SSH connection works
- [ ] MongoDB Atlas allows EC2 IP `13.232.32.147`

---

**That's it! Follow these steps in order and you'll have your app deployed.**

