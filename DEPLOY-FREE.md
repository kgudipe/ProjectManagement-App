# Free, Always-On Deployment (Vercel + Neon + Render)

This gets the app **permanently live at $0** with a link recruiters can click
anytime. The AWS Terraform in [`infra/terraform`](infra/terraform) stays in the
repo as your proof of AWS skills.

```
Frontend  ->  Vercel   (Next.js, free)
Database  ->  Neon     (Postgres, free)
API       ->  Render   (Express, free)
Auth      ->  Cognito  (free tier, optional)
```

Do the steps **in this order** — each one produces a value the next step needs.

---

## Step 1 — Database (Neon)  ~3 min

1. Sign up at https://neon.tech (free, GitHub login).
2. Create a project → it gives you a **connection string** like:
   `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`
3. **Copy it** — this is your `DATABASE_URL`.

## Step 2 — API (Render)  ~5 min

1. Sign up at https://render.com (free, GitHub login).
2. **New → Blueprint** → connect this GitHub repo. Render reads
   [`render.yaml`](render.yaml) automatically.
3. When prompted, set the one secret env var:
   - `DATABASE_URL` = the Neon string from Step 1
4. Click **Apply**. Render installs, generates Prisma, runs migrations, builds,
   and starts the API. Wait for it to go green.
5. Copy your API URL, e.g. `https://project-management-api.onrender.com`.
6. Verify it: open `<API_URL>/health` — you should see `{"status":"ok",...}`.

> Free Render services sleep after ~15 min idle; the first request then takes
> ~30–50s to wake. Fine for a portfolio.

### (Optional) seed sample data
In Render → your service → **Shell**, run:
```bash
npm run seed
```

## Step 3 — Frontend (Vercel)  ~5 min

1. Sign up at https://vercel.com (free, GitHub login).
2. **Add New → Project** → import this repo.
3. Set **Root Directory** to `client` (important — it's a monorepo).
4. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | your Render API URL (no trailing slash) |
   | `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | from Step 4 (or leave blank for now) |
   | `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID` | from Step 4 (or leave blank for now) |
5. **Deploy.** Vercel gives you a live URL like `https://your-app.vercel.app`.

## Step 4 — Auth (Cognito, free)  ~5 min

The app has a sign-in gate, so it needs a Cognito user pool. Cognito's free tier
is **$0 forever** (up to 50k users). If you already created one in your original
deploy, reuse it — otherwise:

1. AWS Console → **Cognito** → **Create user pool**.
2. Sign-in option: **Email**. Defaults are fine.
3. App client: create a **public client** (no client secret).
4. Copy the **User Pool ID** and **App client ID**.
5. Put them into the two Vercel env vars from Step 3, and **redeploy** the Vercel
   project (Deployments → ⋯ → Redeploy).

Now open your Vercel URL, sign up, and use the app. Done — live and $0.

---

## Redeploys

- Push to `main` → Vercel and Render auto-deploy.
- Change an env var → redeploy that service.

## Keeping cost at $0

Neon, Render (free web service), Vercel (Hobby), and Cognito free tier are all
$0. There is nothing to tear down. Just don't upgrade any plan.
