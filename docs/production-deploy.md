# Production deploy — finish the last steps

Code is complete. These three items need your accounts (cannot be automated without login tokens).

## Option A — Fly.io (requires credit card on Fly account)

```powershell
# 1. One-time login (opens browser)
& "$env:USERPROFILE\.fly\bin\flyctl.exe" auth login

# 2. Add billing (one time): https://fly.io/dashboard/personal/billing

# 3. Deploy + wire Vercel automatically
.\backend\deploy-fly.ps1
```

## Option B — Render (free tier, no credit card — recommended if Fly blocks you)

```powershell
.\backend\deploy-render.ps1
```

1. Connect GitHub repo on Render (push documind to GitHub first if needed).
2. Blueprint path: `backend/render.yaml`
3. Add `OPENAI_API_KEY` in Render dashboard.
4. Copy service URL, then:

```powershell
.\scripts\finish-production.ps1 -ApiUrl "https://YOUR-SERVICE.onrender.com"
```

## Option C — Keep using your PC (temporary)

```powershell
.\scripts\keep-api-alive.ps1
```

Leave the window open. Answer `y` to refresh Vercel env when prompted.

## Android APK

```powershell
cd apps\mobile
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

Download APK from the Expo dashboard when the build finishes.

## Security

- Rotate your OpenAI API key at https://platform.openai.com/api-keys (old key was exposed in a terminal).
- `backend/.env` is gitignored — never commit it.
