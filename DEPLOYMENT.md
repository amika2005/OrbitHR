  # Quick Vercel Deployment - Sinhala Guide

## 1. GitHub ekata Push Karanna

```bash
cd C:\Users\user\Desktop\OrbitHR

# Git initialize (if not done)
git init

# All files add karanna
git add .

# Commit karanna
git commit -m "OrbitHR ready for deployment"

# GitHub ekata push karanna (first create repo on github.com)
git remote add origin https://github.com/YOUR_USERNAME/OrbitHR.git
git branch -M main
git push -u origin main
```

## 2. Vercel ekata Deploy Karanna

1. **vercel.com** ekata yanna eka sign in karanna (GitHub account eken)
2. **"Add New Project"** click karanna
3. **GitHub repo eka import karanna** (OrbitHR)
4. **Deploy click karanna**

Eka's it! Vercel automatically deploy karanawa.

## 3. Environment Variables Add Karanna (IMPORTANT!)

Deploy una pasuwa, Vercel dashboard eke:
1. **Settings** → **Environment Variables** ekata yanna
2. Meka add karanna:

```
DATABASE_URL=your_database_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

3. **Redeploy** karanna

## Your Site:
```
https://orbit-hr.vercel.app
```

## Database Setup (Optional - if you want full features)

**Supabase** use karanna (free):
1. supabase.com ekata yanna
2. New project hadanna
3. PostgreSQL connection string eka copy karanna
4. Vercel environment variables ekata add karanna

## Eka's All!

Landing page eka deploy wenawa. Dashboard features walata database ona.

Full guide: `vercel_deployment_guide.md` file eka check karanna.
