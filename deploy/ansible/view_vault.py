#!/usr/bin/env python3
"""
Script to view Ansible vault file using Python
Run: python view_vault.py
"""
import getpass
import sys
import os

try:
    from ansible.parsing.vault import VaultLib
    from ansible.parsing.vault import VaultSecret
except ImportError:
    print("Error: ansible-core not properly installed")
    sys.exit(1)

def view_vault_file():
    vault_file = "inventory/group_vars/all.vault.yml"
    
    if not os.path.exists(vault_file):
        print(f"Error: {vault_file} not found!")
        sys.exit(1)
    
    print(f"Viewing {vault_file}...")
    print("Enter vault password:")
    password = getpass.getpass()
    
    if not password:
        print("Error: Password cannot be empty")
        sys.exit(1)
    
    try:
        # Read the encrypted file
        with open(vault_file, 'rb') as f:
            encrypted = f.read()
        
        # Create vault secret
        vault_secret = VaultSecret(password.encode('utf-8'))
        vault = VaultLib([(None, vault_secret)])
        
        # Decrypt
        decrypted = vault.decrypt(encrypted)
        
        print("\n" + "="*60)
        print("VAULT CONTENTS:")
        print("="*60)
        print(decrypted.decode('utf-8'))
        print("="*60)
        
    except Exception as e:
        print(f"Error: {e}")
        print("\nMost likely the password is incorrect.")
        sys.exit(1)

if __name__ == "__main__":
    view_vault_file()
