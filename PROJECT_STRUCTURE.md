# OrbitHR - Project Structure

```
OrbitHR/
├── .env.local                          # Environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── components.json                     # Shadcn/UI config
├── prisma/
│   ├── schema.prisma                  # Main database schema
│   └── migrations/                    # Auto-generated migrations
├── src/
│   ├── app/                           # Next.js 15 App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── (auth)/                   # Auth routes
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── layout.tsx           # Dashboard layout
│   │   │   ├── dashboard/page.tsx   # Main dashboard
│   │   │   ├── jobs/                # Job management
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── candidates/          # ATS Pipeline
│   │   │   │   ├── page.tsx         # Kanban board
│   │   │   │   └── [id]/page.tsx    # Candidate detail
│   │   │   ├── payroll/             # Payroll module
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── employees/           # Employee management
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── settings/            # Company settings
│   │   │       └── page.tsx
│   │   └── api/                     # API routes
│   │       ├── webhooks/            # External webhooks
│   │       └── cron/                # Scheduled jobs
│   ├── actions/                     # Server Actions
│   │   ├── screen-candidate.ts      # AI screening logic
│   │   ├── job-actions.ts           # Job CRUD
│   │   ├── payroll-actions.ts       # Payroll generation
│   │   └── application-actions.ts   # Application management
│   ├── lib/                         # Utilities
│   │   ├── db.ts                    # Prisma client
│   │   ├── openai.ts                # OpenAI client
│   │   ├── auth.ts                  # Auth helpers
│   │   ├── calculateSalary.ts       # Payroll calculation
│   │   └── utils.ts                 # General utilities
│   ├── components/                  # React components
│   │   ├── ui/                      # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/                  # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── candidates/              # Candidate-specific
│   │   │   ├── PipelineBoard.tsx    # Kanban board
│   │   │   ├── CandidateCard.tsx    # Pipeline card
│   │   │   ├── CandidateModal.tsx   # Review modal
│   │   │   └── PDFViewer.tsx        # Resume viewer
│   │   ├── payroll/                 # Payroll-specific
│   │   │   ├── PayrollTable.tsx     # Employee payroll grid
│   │   │   └── CurrencyToggle.tsx   # JPY/LKR toggle
│   │   └── jobs/                    # Job-specific
│   │       ├── JobCard.tsx
│   │       └── JobForm.tsx
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-company.ts           # Company context
│   │   └── use-currency.ts          # Currency conversion
│   ├── types/                       # TypeScript types
│   │   ├── index.ts
│   │   ├── payroll.ts
│   │   └── ai.ts
│   └── constants/                   # Constants
│       ├── roles.ts
│       ├── countries.ts
│       └── tax-rules.ts
└── public/
    ├── images/
    └── fonts/
```

## Key Design Decisions

### 1. **Route Groups**
- `(auth)` - Public authentication routes
- `(dashboard)` - Protected dashboard routes (Clerk/NextAuth middleware)

### 2. **Server Actions Pattern**
- All mutations go through Server Actions (not API routes)
- Type-safe, direct database access
- Better performance than traditional API routes

### 3. **Component Organization**
- `ui/` - Pure Shadcn/UI primitives
- Feature folders (`candidates/`, `payroll/`) - Domain-specific components
- Colocated with their routes for better maintainability

### 4. **Multi-Tenancy Strategy**
- Every query filtered by `companyId`
- Extracted from user session (Clerk/NextAuth)
- RLS policies in Supabase as backup

### 5. **State Management**
- React Query for server state
- URL state for filters/pagination
- React Context for global UI state (currency preference)
