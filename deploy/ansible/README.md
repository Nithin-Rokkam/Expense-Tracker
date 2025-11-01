# Expense Tracker Ansible Deployment

This directory contains an Ansible playbook that provisions an Ubuntu-based EC2 instance, deploys the Expense Tracker application, and configures Nginx as a reverse proxy.

## Prerequisites

- AWS account with permissions to create EC2 instances, security groups, and IAM roles.
- AWS CLI v2 installed and configured (`aws configure`).
- Ansible >= 2.16 installed locally.
- SSH key pair named `expense-tracker-key` stored at `~/.ssh/expense-tracker-key.pem`.
- Application code pushed to a Git repository accessible from the EC2 host.

Install required collections:

```bash
ansible-galaxy collection install community.general amazon.aws
```

## Directory Layout

- `site.yml` – entry point playbook.
- `inventory/production.yml` – define target hosts.
- `inventory/group_vars/all.yml` – shared variables.
- `inventory/group_vars/all.vault.yml` – **encrypt with Ansible Vault**; holds secrets.
- `roles/common` – base packages, firewall, Node.js.
- `roles/backend` – clones repo, renders `.env`, configures systemd service.
- `roles/frontend` – builds React app, deploys Nginx site, writes `.env.production`.
- `roles/mongo` – optional self-hosted MongoDB installation.

## Preparing Secrets

Edit `inventory/group_vars/all.vault.yml` and encrypt it:

```bash
cd deploy/ansible
ansible-vault encrypt inventory/group_vars/all.vault.yml
```

When prompted, enter a strong vault password. To update later:

```bash
ansible-vault edit inventory/group_vars/all.vault.yml
```

Example secret values:

```yaml
vault_backend_env:
  MONGO_URL: mongodb+srv://<user>:<pass>@cluster/expense
  JWT_SECRET: "replace-me"
  CLIENT_URL: https://expense.example.com
  PORT: 5000

vault_frontend_env:
  VITE_API_URL: https://expense.example.com
```

## Inventory

Update `inventory/production.yml` with your EC2 public IP or hostname.

```yaml
expense-tracker-1:
  ansible_host: 3.92.10.50
```

For dynamic inventory, you can replace the file with the `amazon.aws.aws_ec2` plugin.

## Running the Playbook

```bash
cd deploy/ansible
ansible-playbook site.yml --ask-vault-pass
```

Use `--check --diff` for a dry run. Re-run the play whenever config changes; tasks are idempotent.

## AWS Provisioning Cheat Sheet

1. Create security group, key pair, and optional IAM instance profile.
2. Launch Ubuntu 22.04 instance (t3.small recommended for starter).
3. Record the public IP for the inventory.
4. Open ports 22, 80, 443, and the backend port (5000 by default).

Sample commands:

```bash
aws ec2 create-security-group --group-name expense-tracker-sg --description "Expense Tracker"
aws ec2 authorize-security-group-ingress --group-name expense-tracker-sg --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 run-instances --image-id <AMI> --instance-type t3.small --key-name expense-tracker-key --security-groups expense-tracker-sg
```

## Manual Follow-ups

- Add DNS record pointing to the EC2 instance.
- Optionally enable HTTPS (e.g., using Certbot or an AWS Load Balancer).
- Monitor services with `systemctl status expense-tracker` and `journalctl -u expense-tracker -f`.
- Regularly rotate secrets and update via Vault.

