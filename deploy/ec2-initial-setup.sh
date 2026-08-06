#!/bin/bash
# Run this ONCE on your AWS EC2 instance to prepare it for CI/CD deployments.
# Usage: bash ec2-initial-setup.sh

set -e

echo "== Installing Node.js (v20) =="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "== Installing Nginx =="
sudo apt update
sudo apt install -y nginx

echo "== Cloning repository =="
cd /home/ubuntu
if [ ! -d "expense-tracker" ]; then
  read -p "Enter your GitHub repo URL: " REPO_URL
  git clone "$REPO_URL" expense-tracker
fi

echo "== Installing backend dependencies =="
cd /home/ubuntu/expense-tracker/backend
npm install

echo "== Installing frontend dependencies & building =="
cd /home/ubuntu/expense-tracker/frontend
npm install
npm run build

echo "== Setting up systemd service for backend =="
sudo cp /home/ubuntu/expense-tracker/deploy/expense-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable expense-backend
sudo systemctl start expense-backend

echo "== Setting up Nginx for frontend =="
sudo cp /home/ubuntu/expense-tracker/deploy/nginx-expense-tracker.conf /etc/nginx/sites-available/expense-tracker
sudo ln -sf /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/expense-tracker
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "== Done! =="
echo "Visit http://<your-ec2-public-ip>/ to see the app."
echo "Backend health check: http://<your-ec2-public-ip>/health"
