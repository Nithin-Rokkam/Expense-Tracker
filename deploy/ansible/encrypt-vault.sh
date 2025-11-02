#!/bin/bash
# Script to encrypt Ansible vault file
# Run in WSL: wsl bash encrypt-vault.sh

cd /mnt/c/Users/nithi/OneDrive/Desktop/CSE/Expense-Tracker/deploy/ansible

echo "=================================="
echo "Encrypting Ansible Vault File"
echo "=================================="
echo ""
echo "File: inventory/group_vars/all.vault.yml"
echo ""
echo "You will be prompted to enter a password."
echo "Enter a STRONG password and remember it!"
echo "(You'll need this password every time you run the playbook)"
echo ""
echo "Press Enter to continue..."
read

ansible-vault encrypt inventory/group_vars/all.vault.yml

echo ""
echo "=================================="
if [ $? -eq 0 ]; then
    echo "✓ Vault file encrypted successfully!"
    echo ""
    echo "To verify, run:"
    echo "  head -n 3 inventory/group_vars/all.vault.yml"
    echo ""
    echo "You should see: \$ANSIBLE_VAULT;1.1;AES256"
else
    echo "✗ Encryption failed. Please try again."
fi
echo "=================================="

