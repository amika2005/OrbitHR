# OrbitHR - Enterprise HRIS & ATS System

> A production-ready, AI-powered HR management system designed for companies operating in Japan and Sri Lanka.

## 🚀 Features

### 🤖 **AI-Powered Recruitment**
- Automated resume screening using GPT-4o-mini
- Technical fit scoring (0-100)
- Japanese cultural fit analysis
- Skill gap identification
- Human-in-the-loop approval workflow

### 💼 **Applicant Tracking System (ATS)**
- Beautiful Kanban-style pipeline board
- Drag-and-drop candidate management
- Interview scheduling
- PDF resume viewer
- Status tracking (New → AI Screened → Interview → Hired)

### 💰 **Multi-Country Payroll**
- **Sri Lanka**: EPF (8%/12%), ETF (3%), Progressive tax
- **Japan**: Social Insurance (15%), Income tax (10%)
- Real-time currency conversion (JPY ⇄ LKR)
- Automated salary calculations
- CSV export for accounting

### 🏢 **Multi-Tenancy**
- Company-level data isolation
- Role-based access control (Super Admin, HR Manager, Employee, Candidate)
- Clerk authentication with SSO support

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Auth**: Clerk
- **AI**: OpenAI GPT-4o-mini
- **State**: TanStack Query
- **UI**: Shadcn/UI + Tailwind CSS
- **Deployment**: Vercel

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed folder layout.

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- Clerk account
- OpenAI API key

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/OrbitHR.git
cd OrbitHR
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`:
- Supabase database URLs
- Clerk API keys
- OpenAI API key

4. **Push database schema**
```bash
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete step-by-step instructions including:
- Supabase setup
- Clerk configuration
- Vercel deployment
- Environment variables
- Database migrations
- Webhook setup

## 💡 Key Components

### AI Screening Engine
Located in `src/actions/screen-candidate.ts`
- Analyzes resume vs job description
- Scores technical + cultural fit
- Identifies missing skills
- Japanese workplace value assessment

### Payroll Calculator
Located in `src/lib/calculateSalary.ts`
- Country-specific tax rules
- Progressive tax brackets (Sri Lanka)
- Social insurance calculations (Japan)
- Currency conversion

### Pipeline Board
Located in `src/components/candidates/PipelineBoard.tsx`
- Drag-and-drop interface
- Real-time status updates
- Visual score indicators
- Interview scheduling

## 📊 Database Schema

- **Company**: Multi-tenant company settings
- **User**: Employees, managers, candidates
- **Job**: Open positions
- **Application**: Candidate applications with AI scores
- **PayrollRecord**: Monthly salary calculations
- **Workflow**: Automation triggers

## 🔐 Security

- Row-level security (RLS) in Supabase
- Clerk session management
- API key rotation recommended every 90 days
- HTTPS-only in production
- Environment variable validation

## 💰 Cost Estimate

### Free Tier (0-10k users)
- Vercel: Free
- Supabase: Free (500MB DB)
- Clerk: Free (10k MAUs)
- OpenAI: ~$5-20/mo (pay-as-you-go)

**Total**: ~$5-20/month

## 🧪 Testing

```bash
npm run lint
npm run build
```

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

- Documentation: See `/docs` folder
- Issues: [GitHub Issues](https://github.com/yourusername/OrbitHR/issues)

---

**Built with ❤️ for modern HR teams**
