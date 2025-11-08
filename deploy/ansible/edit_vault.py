#!/usr/bin/env python3
"""
Script to edit Ansible vault file using Python
Run: python edit_vault.py
"""
import getpass
import sys
import os
import tempfile
import subprocess

try:
    from ansible.parsing.vault import VaultLib
    from ansible.parsing.vault import VaultSecret
except ImportError:
    print("Error: ansible-core not properly installed")
    sys.exit(1)

def edit_vault_file():
    vault_file = "inventory/group_vars/all.vault.yml"
    
    if not os.path.exists(vault_file):
        print(f"Error: {vault_file} not found!")
        sys.exit(1)
    
    print(f"Editing {vault_file}...")
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
        
        # Create temporary file for editing
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yml', delete=False) as tmp:
            tmp.write(decrypted.decode('utf-8'))
            tmp_path = tmp.name
        
        print(f"\nOpening editor for {tmp_path}...")
        print("Edit the file, save, and close the editor to continue.")
        
        # Try to open with notepad (Windows)
        editor = os.environ.get('EDITOR', 'notepad')
        subprocess.call([editor, tmp_path])
        
        # Read the edited content
        with open(tmp_path, 'r', encoding='utf-8') as f:
            new_content = f.read()
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        # Ask for confirmation
        print("\nDo you want to save the changes? (yes/no): ", end='')
        confirm = input().strip().lower()
        
        if confirm not in ['yes', 'y']:
            print("Changes discarded.")
            sys.exit(0)
        
        # Encrypt the new content
        encrypted_new = vault.encrypt(new_content.encode('utf-8'))
        
        # Write back to file
        with open(vault_file, 'wb') as f:
            f.write(encrypted_new)
        
        print(f"\n✓ Successfully updated {vault_file}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    edit_vault_file()
