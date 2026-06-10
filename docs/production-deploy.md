# Production deploy — DocuMind API

## Render (recommended — free tier)

```powershell
# 1. Push repo
.\backend\deploy-render.ps1

# 2. In Render dashboard → documind-api → Environment, set:
#    GOOGLE_API_KEY          (from https://aistudio.google.com/apikey)
#    SUPABASE_URL            (https://YOUR_PROJECT.supabase.co)
#    SUPABASE_SERVICE_ROLE_KEY
#    SUPABASE_JWT_SECRET     (Supabase → Settings → API → JWT Secret)
#    RAG_API_KEY             (optional shared secret, e.g. openssl rand -hex 32)

# 3. Wire Vercel to the API URL:
.\scripts\finish-production.ps1 -ApiUrl "https://documind-api-drsq.onrender.com"
```

If you set `RAG_API_KEY` on Render, also add it on Vercel as `RAG_API_KEY` (web proxy uses it).

## Chroma persistence on Render

Free Render instances use **ephemeral disk** — indexed documents are lost on redeploy/restart. Users must re-upload after a deploy.

To persist vectors, upgrade to Render **Starter** and uncomment the `disk:` block in `render.yaml`.

## Fly.io (requires credit card)

```powershell
flyctl auth login
.\backend\deploy-fly.ps1
```

## Local dev (temporary cloud URL)

```powershell
.\scripts\keep-api-alive.ps1
```

## Android APK

```powershell
cd apps\mobile
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

## Security checklist

- Rotate `GOOGLE_API_KEY` if it was ever exposed in a terminal
- Set `SUPABASE_JWT_SECRET` + service role on Render so only signed-in users can chat/ingest their own docs
- Set `RAG_API_KEY` to block anonymous API access
- Never commit `backend/.env`
