#!/bin/bash
# Test SSH connection to EC2 instance
echo "Testing SSH connection to EC2 instance..."
echo "Instance IP: 13.232.32.147"
echo ""
echo "Attempting to connect..."
ssh -i ~/.ssh/MyKeyPair.pem ubuntu@13.232.32.147 "echo 'Connection successful!'; hostname; whoami"

