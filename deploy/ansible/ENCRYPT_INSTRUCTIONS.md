# How to Encrypt Your Vault File

## Step 1: Open WSL Terminal

In PowerShell, run:
```powershell
wsl
```

You'll be in a Linux terminal now.

## Step 2: Install Ansible in WSL

You'll need your WSL password when prompted:

```bash
sudo apt update
sudo apt install -y ansible ansible-core
```

## Step 3: Navigate to Ansible Directory

Windows files are accessible via `/mnt/c/`:

```bash
cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible
```

## Step 4: Encrypt the Vault File

```bash
ansible-vault encrypt inventory/group_vars/all.vault.yml
```

**Enter a strong password** when prompted (you'll need this every time you run the playbook).

Type the password twice to confirm.

## Step 5: Verify Encryption

You should see the file is now encrypted:

```bash
head -n 5 inventory/group_vars/all.vault.yml
```

It should show `$ANSIBLE_VAULT;` at the top.

## Step 6: Exit WSL

```bash
exit
```

## That's It!

Now you can run the playbook from PowerShell:
```powershell
cd deploy\ansible
ansible-playbook site.yml --ask-vault-pass
```

---

## Alternative: If You Can't Install in WSL

If sudo password doesn't work, you can:
1. Temporarily skip encryption for testing (see QUICK_START.md)
2. Use a Linux VM or remote server
3. Manually edit the template file to include secrets (NOT RECOMMENDED for production)

