# OrbitHR - Deployment Guide

## Prerequisites

1. **GitHub Account** (for version control)
2. **Vercel Account** (free tier works) - https://vercel.com
3. **Supabase Account** (free tier works) - https://supabase.com
4. **Clerk Account** (free tier: 10k MAUs) - https://clerk.com
5. **OpenAI API Key** - https://platform.openai.com

---

## Step 1: Set Up Supabase Database

### 1.1 Create a New Project
1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Choose organization, project name: `OrbitHR`
4. Choose a **strong database password** (save it!)
5. Select region closest to your users (Japan: Tokyo, Sri Lanka: Singapore)
6. Wait 2-3 minutes for provisioning

### 1.2 Get Database Credentials
Once the project is ready:
1. Go to **Settings** → **Database**
2. Copy the **Connection String (URI)** under "Connection Pooling"
3. It looks like: `postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

### 1.3 Enable Row Level Security (RLS)
Run this SQL in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their company's data
CREATE POLICY "Users can access own company data" ON companies
  FOR ALL USING (auth.uid() IN (
    SELECT clerk_id FROM users WHERE company_id = companies.id
  ));

-- Apply similar policies to other tables
-- (Full RLS implementation in production would be more comprehensive)
```

---

## Step 2: Set Up Clerk Authentication

### 2.1 Create Application
1. Go to https://dashboard.clerk.com
2. Click **"Add Application"**
3. Application name: `OrbitHR`
4. Enable authentication methods:
   - ✅ Email + Password
   - ✅ Google OAuth (recommended)
   - ✅ Microsoft OAuth (for enterprise)

### 2.2 Get API Keys
1. Go to **API Keys** in sidebar
2. Copy:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

### 2.3 Configure User Metadata
1. Go to **User & Authentication** → **Metadata**
2. Add custom fields for `companyId` and `role`

---

## Step 3: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name it: `OrbitHR Production`
4. Copy the key (starts with `sk-proj-...`)
5. **Important**: You'll only see it once!

---

## Step 4: Push Code to GitHub

### 4.1 Initialize Git Repository
Open terminal in `OrbitHR` folder:

```bash
git init
git add .
git commit -m "Initial OrbitHR setup"
```

### 4.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `OrbitHR`
3. Make it **Private** (important for production)
4. Don't initialize with README (we already have code)

### 4.3 Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/OrbitHR.git
git branch -M main
git push -u origin main
```

---

## Step 5: Deploy to Vercel

### 5.1 Import Project
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `OrbitHR` repository
4. Framework Preset: **Next.js** (auto-detected)

### 5.2 Configure Environment Variables
Before deploying, add these environment variables in Vercel:

#### Database
```
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```
> **Note**: `DATABASE_URL` uses port **6543** (connection pooling), `DIRECT_URL` uses **5432** (direct connection for migrations)

#### Clerk
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

#### OpenAI
```
OPENAI_API_KEY="sk-proj-xxxxxxxxx"
```

#### App Configuration
```
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"
NODE_ENV="production"
```

### 5.3 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app will be live at `https://your-app-name.vercel.app`

---

## Step 6: Run Database Migrations

### 6.1 Install Prisma CLI Locally
```bash
npm install -D prisma
npm install @prisma/client
```

### 6.2 Generate Prisma Client
```bash
npx prisma generate
```

### 6.3 Push Schema to Database
```bash
npx prisma db push
```

This creates all tables in your Supabase database.

### 6.4 Seed Initial Data (Optional)
Create `prisma/seed.ts`:

```typescript
import { PrismaClient, UserRole, Country, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a demo company
  const company = await prisma.company.create({
    data: {
      name: "Demo Company",
      slug: "demo",
      country: Country.JAPAN,
      currency: Currency.JPY,
      taxRules: {},
      settings: {},
    },
  });

  console.log("Created demo company:", company.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npx prisma db seed
```

---

## Step 7: Configure Clerk Webhooks (Important!)

### 7.1 Create Webhook Endpoint
In your Next.js app, create `src/app/api/webhooks/clerk/route.ts`:

```typescript
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  // Handle user.created event
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    await db.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name || "",
        lastName: last_name || "",
        role: "EMPLOYEE", // Default role
        companyId: "YOUR_COMPANY_ID", // Set based on signup flow
      },
    });
  }

  return new Response("Webhook processed", { status: 200 });
}
```

### 7.2 Configure in Clerk Dashboard
1. Go to **Webhooks** in Clerk dashboard
2. Click **"Add Endpoint"**
3. Endpoint URL: `https://your-app-name.vercel.app/api/webhooks/clerk`
4. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret**
6. Add to Vercel environment variables:
   ```
   CLERK_WEBHOOK_SECRET="whsec_xxxxxxxxx"
   ```

---

## Step 8: Install Required Dependencies

### 8.1 Core Dependencies
```bash
npm install next@latest react@latest react-dom@latest
npm install @prisma/client
npm install @clerk/nextjs
npm install openai
npm install @tanstack/react-query
npm install @tanstack/react-table
npm install @hello-pangea/dnd
```

### 8.2 Shadcn/UI Setup
```bash
npx shadcn-ui@latest init
```

Choose:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Install components:
```bash
npx shadcn-ui@latest add button card dialog input table textarea badge separator avatar
```

### 8.3 Dev Dependencies
```bash
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D prisma
npm install -D eslint eslint-config-next
```

---

## Step 9: Package.json Scripts

Update `package.json`:

```json
{
  "name": "orbithir",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## Step 10: Vercel Build Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "next dev"
}
```

---

## Cost Estimates (Free Tier Usage)

### Monthly Costs (Starting)
- **Vercel**: $0 (Free tier: 100GB bandwidth)
- **Supabase**: $0 (Free tier: 500MB database, 2GB storage)
- **Clerk**: $0 (Free tier: 10,000 monthly active users)
- **OpenAI**: ~$5-20 (Pay-as-you-go, gpt-4o-mini: $0.15/1M input tokens)

**Total**: ~$5-20/month for up to 10k users!

### When to Upgrade
- **Supabase Pro** ($25/mo): When database > 500MB or need daily backups
- **Vercel Pro** ($20/mo): When bandwidth > 100GB or need team collaboration
- **Clerk Pro** ($25/mo): When MAU > 10k

---

## Step 11: Post-Deployment Checklist

✅ **Security**
- [ ] Enable 2FA on all accounts (GitHub, Vercel, Supabase, Clerk)
- [ ] Rotate all API keys every 90 days
- [ ] Set up Vercel password protection for staging environments
- [ ] Enable Supabase database backups

✅ **Monitoring**
- [ ] Set up Vercel Analytics (free)
- [ ] Configure error tracking (Sentry recommended)
- [ ] Set up uptime monitoring (UptimeRobot free tier)

✅ **Performance**
- [ ] Enable Vercel Edge Functions for API routes
- [ ] Configure Prisma connection pooling
- [ ] Set up CDN for static assets

✅ **Compliance**
- [ ] Add privacy policy (required for Japan/SL)
- [ ] Implement GDPR cookie consent
- [ ] Configure data retention policies

---

## Troubleshooting Common Issues

### Issue 1: Prisma Client Not Generated
**Solution:**
```bash
npx prisma generate
vercel env pull .env.local  # Sync env vars locally
```

### Issue 2: Clerk Session Not Found
**Solution:**
- Ensure middleware is properly configured in `src/middleware.ts`
- Check that Clerk keys are in environment variables
- Clear browser cookies and re-login

### Issue 3: OpenAI API Rate Limit
**Solution:**
- Implement request queuing
- Add retry logic with exponential backoff
- Upgrade to OpenAI Tier 2 ($50 credit usage)

### Issue 4: Database Connection Timeout
**Solution:**
- Use `DATABASE_URL` with port 6543 (pooling)
- Reduce Prisma connection pool size in production
- Enable Supabase connection pooling in project settings

---

## Next Steps

1. **Customize branding** (logo, colors in `tailwind.config.ts`)
2. **Add email notifications** (SendGrid, Resend, or Postmark)
3. **Implement file uploads** (Supabase Storage for resumes)
4. **Add analytics dashboard** (Recharts or Chart.js)
5. **Build mobile app** (React Native with Expo)

---

## Support & Resources

- **Documentation**: https://docs.factory.ai (for Droid)
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs
- **Clerk Docs**: https://clerk.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

**Built with ❤️ for modern HR teams**
