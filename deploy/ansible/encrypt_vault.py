#!/usr/bin/env python3
"""
Script to encrypt Ansible vault file using Python
Run: python encrypt_vault.py
"""
import getpass
import sys
import os

try:
    from ansible.parsing.vault import VaultLib
    from ansible.constants import DEFAULT_VAULT_ID_MATCH
except ImportError:
    print("Error: ansible-core not properly installed")
    print("Trying alternative method...")
    sys.exit(1)

def encrypt_vault_file():
    vault_file = "inventory/group_vars/all.vault.yml"
    
    if not os.path.exists(vault_file):
        print(f"Error: {vault_file} not found!")
        sys.exit(1)
    
    print(f"Encrypting {vault_file}...")
    print("Enter a vault password (it will not be displayed):")
    password = getpass.getpass()
    
    if not password:
        print("Error: Password cannot be empty")
        sys.exit(1)
    
    print("Confirm password:")
    password2 = getpass.getpass()
    
    if password != password2:
        print("Error: Passwords don't match!")
        sys.exit(1)
    
    try:
        # Read the plain text file
        with open(vault_file, 'r', encoding='utf-8') as f:
            plaintext = f.read()
        
        # Create vault and encrypt
        vault = VaultLib([(DEFAULT_VAULT_ID_MATCH, VaultLib.encrypt)])
        vault.secrets = [(DEFAULT_VAULT_ID_MATCH, password)]
        
        encrypted = vault.encrypt(plaintext.encode('utf-8'))
        
        # Write encrypted content
        with open(vault_file, 'wb') as f:
            f.write(encrypted)
        
        print(f"\n✓ Successfully encrypted {vault_file}")
        print("⚠ Remember this password - you'll need it to run the playbook!")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    encrypt_vault_file()

