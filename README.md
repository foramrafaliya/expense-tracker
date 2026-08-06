# Expense Tracker — Frontend/Backend CI/CD Demo

A simple full-stack Expense Tracker app used to practice **independent CI/CD
pipelines** for a frontend and a backend that live in the same repository
(mono-repo).

```
expense-tracker/
├── frontend/                  React (Vite) app
├── backend/                   Node.js + Express API
├── deploy/                    Scripts/configs to run on the EC2 server
└── .github/workflows/
    ├── frontend.yml           Runs ONLY when frontend/** changes
    └── backend.yml            Runs ONLY when backend/** changes
```

---

## 1. Push this project to GitHub

```bash
cd expense-tracker
git init
git add .
git commit -m "Initial commit: expense tracker app"
git branch -M main
git remote add origin https://github.com/<your-username>/expense-tracker.git
git push -u origin main
```

---

## 2. One-time EC2 server setup

SSH into your EC2 instance, copy this project there (or just clone it after
pushing to GitHub), then run:

```bash
bash deploy/ec2-initial-setup.sh
```

This installs Node.js + Nginx, clones the repo, builds the frontend, and
sets up the backend as a systemd service (`expense-backend`) plus Nginx to
serve the frontend and reverse-proxy `/api/` to the backend.

---

## 3. GitHub Secrets (required for auto-deploy)

In your GitHub repo: **Settings → Secrets and variables → Actions → New
repository secret**. Add:

| Secret name | Value |
|---|---|
| `EC2_HOST` | Your EC2 public IP |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Contents of your `.pem` private key file |
| `EC2_SSH_PORT` | `2222` (or your custom SSH port) |

---

## 4. How the path-based triggers work

Both workflow files use a `paths:` filter under `on: push:`:

```yaml
on:
  push:
    branches: [main]
    paths:
      - "frontend/**"
```

- If you only change files inside `frontend/`, **only `frontend.yml` runs**
  → only the frontend gets rebuilt and redeployed.
- If you only change files inside `backend/`, **only `backend.yml` runs**
  → only the backend gets restarted.
- If you change files in both folders in the same push, both workflows run
  independently, in parallel.

Test it:
```bash
# Change something in frontend only
echo "/* test */" >> frontend/src/App.css
git add . && git commit -m "test: frontend only change" && git push
# → Check GitHub Actions tab: only "Frontend CI/CD" should run

# Change something in backend only
echo "// test" >> backend/server.js
git add . && git commit -m "test: backend only change" && git push
# → Check GitHub Actions tab: only "Backend CI/CD" should run
```

---

## 5. Local development (optional, to test before pushing)

```bash
# Backend
cd backend
npm install
npm start          # runs on http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev         # runs on http://localhost:5173
```

---

## 6. Useful commands on the server

```bash
sudo systemctl status expense-backend     # check backend service
sudo journalctl -u expense-backend -f       # live backend logs
curl http://localhost/health                 # health check via Nginx
```
