# FitPilot Pro — Claude Code Project Context
**Last updated:** March 2026
**Maintained by:** Gustavo Aragones / Albor Digital LLC

---

## ROLE

You are the **lead developer** for FitPilot Pro. You have full read/write access to this codebase. You execute builds, fix errors, write features, and commit code. You do not ask for permission to make obvious fixes. You do not explain what you're about to do — you do it, then report what changed.

Browser Claude (claude.ai) handles architecture decisions and design reviews. Your role is execution.

---

## WHAT THIS APP IS

FitPilot Pro is a **SaaS business management platform for personal trainers**. It helps trainers manage clients, schedule sessions, track progress, analyze revenue, and optimize travel routes between client locations.

**Owner:** Gustavo Aragones Malmborg — gustavoaragones@gmail.com
**Company:** Albor Digital LLC (Wyoming, USA / Canada)
**Target URL:** fitpilotpro.app
**Current environment:** localhost (dev)

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript + React 19 |
| Styling | Tailwind CSS (no external UI library) |
| Auth + DB | Supabase (PostgreSQL + Auth + Storage + RLS) |
| State | TanStack Query (React Query) + Zustand |
| Forms | react-hook-form + zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Maps/Travel | Google Maps Geocoding API + Haversine fallback |
| AI features | Anthropic Claude API (server-side, AI Scheduler) |
| Payments | Stripe (subscriptions + webhooks) |
| Email | Resend |
| Hosting | Vercel |
| Icons | Lucide React — **no emoji anywhere in the codebase** |

---

## DESIGN SYSTEM — NON-NEGOTIABLE

These values are absolute. Never invent new colors. Never use Tailwind color names for brand colors — always use hex.

```
Background:     #1A1A1A  (page bg)
Surface:        #2A2A2A  (cards)
Surface raised: #313131  (hover states, nested cards)
Border:         #3A3A3A  (all card borders)
Border subtle:  #2A2A2A  (dividers within cards)

Accent (lime):  #CCFF00  (buttons, active nav, highlights)
Accent hover:   #B8E600
Accent muted:   #CCFF00/10 (tinted backgrounds)

Text primary:   #FFFFFF
Text secondary: #A0A0A0
Text tertiary:  #555555
Text disabled:  #444444

Success:   #4ADE80
Warning:   #FACC15
Error:     #EF4444
Info:      #60A5FA

Diamond tier: #CCFF00 (lime)
Gold tier:    #FACC15 (yellow)
Silver tier:  #9CA3AF (gray)
```

### Critical rules
- **Lime buttons ALWAYS use `text-[#000000]`** — never white or gray text on `#CCFF00`
- **No `text-black`** on lime — use `text-[#000000]` to force true black
- **No white backgrounds** anywhere in the dashboard
- **No emoji** — use Lucide React icons exclusively
- **No spinners** — use skeleton loaders for all loading states
- **`min-h-[44px]`** on every button and interactive element (mobile tap target)
- **Cards always have `border border-[#3A3A3A]`** — never flat/borderless
- **All transitions:** `transition-all duration-150` minimum

### Tier badge colors
```typescript
diamond: { icon: Gem,   text: 'text-[#CCFF00]', bg: 'bg-[#CCFF00]/10 border border-[#CCFF00]/20' }
gold:    { icon: Star,  text: 'text-[#FACC15]', bg: 'bg-[#FACC15]/10 border border-[#FACC15]/20' }
silver:  { icon: Medal, text: 'text-[#9CA3AF]', bg: 'bg-[#9CA3AF]/10 border border-[#9CA3AF]/20' }
```

---

## DATABASE SCHEMA (Supabase / PostgreSQL)

### `profiles` table
```
id (uuid, FK → auth.users)
email, full_name, business_name
role ('personal_trainer' | 'fitness_coach' | 'studio_owner')
subscription_tier ('free' | 'professional' | 'elite' | 'studio')
onboarding_completed (boolean)
stripe_customer_id, stripe_subscription_id
created_at, updated_at
```

### `clients` table
```
id, trainer_id (FK → profiles)
full_name, email, phone, date_of_birth, avatar_url
address, emergency_contact_name, emergency_contact_phone
goal, health_conditions, fitness_level, preferred_location
session_price, sessions_per_week, payment_model
attendance_rate, tier ('diamond'|'gold'|'silver'), tier_score
status ('active'|'inactive'|'prospect')
notes, created_at, updated_at
```

### `sessions` table
```
id, trainer_id, client_id (FK → clients), routine_id
scheduled_at (timestamptz), duration_minutes
location, location_type, price
payment_status ('paid'|'unpaid'|'waived'), payment_method
status ('scheduled'|'completed'|'cancelled'|'no_show')
cancellation_reason, notes, trainer_notes
is_recurring, recurrence_rule, recurrence_group_id
created_at, updated_at
```

### `routines` table
```
id, trainer_id
name, description, focus, goal, equipment
difficulty ('beginner'|'intermediate'|'advanced'|'athletic')
duration_minutes, warm_up_notes, cool_down_notes
tags (text[]), is_template
created_at, updated_at
```

### `exercises` table
```
id, trainer_id (null = global)
name, description, muscle_groups (text[])
equipment, difficulty, instructions
image_url, video_url
created_at, updated_at
```

### `routine_exercises` table
```
id, routine_id, exercise_id
sets, reps, duration_seconds, rest_seconds
order_index, notes
```

### `progress_records` table
```
id, trainer_id, client_id
recorded_at (date)
weight_kg, body_fat_pct, skeletal_muscle_pct
visceral_fat, body_water_pct
chest_cm, waist_cm, hips_cm, arms_cm, thighs_cm, calves_cm
notes, photo_urls (text[])
created_at, updated_at
```

### `payments` table
```
id, trainer_id, client_id, session_id
amount, currency ('CAD'|'USD')
payment_date, payment_method, status
invoice_number, notes
created_at, updated_at
```

### Key Supabase config
- RLS is enabled on all tables — every query must be scoped to `trainer_id = auth.uid()`
- `handle_new_user()` trigger auto-creates a `profiles` row on `auth.users` insert
- `set_updated_at()` trigger auto-updates `updated_at` on all tables

---

## FILE STRUCTURE

```
fitpilotpro/
├── app/
│   ├── (auth)/              # login, signup, forgot-password + layout
│   ├── (dashboard)/         # all authenticated pages + layout
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── routines/
│   │   ├── schedule/
│   │   ├── progress/
│   │   ├── analytics/
│   │   ├── ai-scheduler/
│   │   ├── social-export/
│   │   └── settings/
│   ├── (marketing)/         # landing page, pricing, legal pages
│   │   ├── pricing/
│   │   ├── terms/
│   │   ├── privacy/
│   │   ├── disclaimer/
│   │   └── cookies/
│   ├── (onboarding)/        # 5-step new user setup flow
│   │   └── onboarding/
│   ├── api/
│   │   ├── auth/callback/
│   │   ├── stripe/create-checkout/
│   │   ├── stripe/create-portal/
│   │   ├── stripe/webhook/
│   │   └── ai-scheduler/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/              # Sidebar, MobileNav, TopBar
│   ├── ui/                  # Button, DatePicker, TimePicker, Modal, Badge, Skeleton, Avatar
│   ├── dashboard/           # StatsGrid, TodaysSchedule, QuickActions, UpcomingSessions
│   ├── clients/             # ClientsView, ClientCard, ClientModal, TierGroupHeader, ClientsSkeleton
│   ├── schedule/            # ScheduleView, MiniCalendar, SessionRow, SessionModal, TravelIntelligencePanel
│   ├── routines/            # (pending Prompt #07)
│   ├── progress/            # (pending Prompt #08)
│   ├── analytics/           # (pending Prompt #09)
│   └── marketing/           # Navbar, Hero, Features, Pricing, Footer, LegalPageLayout
├── hooks/
│   ├── useDashboard.ts
│   ├── useSchedule.ts
│   └── useSubscription.ts
├── lib/
│   ├── supabase/client.ts + server.ts
│   ├── stripe/client.ts
│   ├── travel.ts            # Haversine + Google Maps geocoding for Travel Intelligence
│   ├── tier-calculator.ts
│   └── utils.ts
├── types/
│   └── index.ts             # Client, Session, SessionWithClient, Profile, etc.
├── supabase/
│   └── schema.sql
├── public/
│   └── logo.png             # MUST use next/image, never <img>
├── DESIGN_SYSTEM.md         # Full visual spec — reference before building any component
├── CLAUDE.md                # This file
├── middleware.ts            # Auth protection for /dashboard/*, /onboarding/*
└── .env.local               # See Environment Variables section
```

---

## ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUAL=
STRIPE_PRICE_ELITE_MONTHLY=
STRIPE_PRICE_ELITE_ANNUAL=
STRIPE_PRICE_STUDIO_MONTHLY=
STRIPE_PRICE_STUDIO_ANNUAL=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
FROM_EMAIL=noreply@fitpilotpro.app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## SUBSCRIPTION TIERS

| Tier | Price | Client Limit | Key Gated Features |
|------|-------|-------------|-------------------|
| Free | $0 | 5 clients | Core features only |
| Professional | $19.99/mo | Unlimited | Route optimizer, analytics, social export, integrations |
| Elite | $39.99/mo | Unlimited | + AI Scheduler, custom branding, client app |
| Studio | $99.99/mo | Unlimited | + Multi-trainer, white-label, team scheduling |

**14-day Pro trial** on signup. Stripe handles all billing. `profiles.subscription_tier` is the source of truth.

---

## CLIENT TIER ALGORITHM

Auto-calculated on client create/update. Never user-selectable.

```typescript
const priceScore   = price >= 100 ? 40 : price >= 60 ? 24 : 0;   // 40% weight
const freqScore    = freq >= 4 ? 30 : freq >= 2 ? 18 : 0;         // 30% weight
const paymentScore = model === 'upfront' ? 20 : model === 'monthly' ? 12 : 0; // 20% weight
// attendance: 10% weight — applied as tier boost at 90%+ attendance
const total = priceScore + freqScore + paymentScore;
tier = total >= 70 ? 'diamond' : total >= 40 ? 'gold' : 'silver';
```

---

## TRAVEL INTELLIGENCE FEATURE

Located in `lib/travel.ts` and `components/schedule/TravelIntelligencePanel.tsx`.

- Uses **Haversine formula** for straight-line distance (free, no API)
- Estimates urban drive time at 25 km/h average
- Upgrades to **Google Maps Geocoding API** if `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Appears in the Schedule Session modal when: client selected + date/time chosen + other sessions exist that day
- Shows: previous session → drive time → new session → drive time → next session
- Quality ratings: green (<20 min total) / yellow (20-40 min) / red (>40 min)
- "Open in Google Maps" generates a multi-stop URL — zero API cost

---

## BUILD COMMANDS

```bash
npm run dev          # Start dev server (usually port 3000, may be 3003, 3005, 3007)
npm run build        # Production build — must pass with zero errors before any commit
npm run lint         # ESLint check
npx tsc --noEmit    # TypeScript check without building
```

**Always run `npm run build` before declaring a task complete.** Zero TypeScript errors required.

---

## CODING STANDARDS

### TypeScript
- No `any` type without a comment explaining why
- All Supabase query results must be typed (use types from `types/index.ts`)
- Use `type` not `interface` for data shapes (consistent with existing codebase)

### Components
- `'use client'` directive required on any component using hooks, state, or browser APIs
- Server components for data fetching at page level where possible
- All components in `components/` must be named exports (not default)
- Page files in `app/` use default exports

### Supabase queries
- Always scope queries: `.eq('trainer_id', user.id)` — RLS is enabled but defense in depth
- Use TanStack Query for all client-side data fetching
- Invalidate related queries after mutations: sessions-day, sessions-month, todays-sessions, dashboard-stats
- Never fetch in `useEffect` directly — always use `useQuery`

### Forms
- All forms use `react-hook-form` + `zod` validation
- No uncontrolled inputs in modals
- Validation errors display below each field in `text-[#EF4444]`

### Loading states
- Skeleton loaders only — never spinners
- Skeleton shapes must match the real content shape
- Use `animate-pulse` on skeleton elements

### Error handling
- All mutations wrapped in try/catch or use `useMutation`'s `onError`
- User-facing errors in red error boxes, never `console.error` only
- Network errors never crash the page — show graceful fallback

---

## PAGES STATUS

| Page | Route | Status |
|------|-------|--------|
| Landing page | `/` | ✅ Complete |
| Pricing | `/pricing` | ✅ Complete |
| Legal pages | `/terms`, `/privacy`, `/disclaimer`, `/cookies` | ✅ Complete |
| Login | `/login` | ✅ Complete |
| Signup | `/signup` | ✅ Complete |
| Forgot password | `/forgot-password` | ✅ Complete |
| Onboarding | `/onboarding` | ✅ Complete (5 steps) |
| Dashboard | `/dashboard` | ✅ Complete (live Supabase data) |
| Clients | `/clients` | ✅ Complete (CRUD, tier grouping, modal) |
| Schedule | `/schedule` | ✅ Complete (calendar, sessions, Travel Intelligence) |
| Routines | `/routines` | ⬜ Pending |
| Progress | `/progress` | ⬜ Pending |
| Analytics | `/analytics` | ⬜ Pending |
| AI Scheduler | `/ai-scheduler` | ⬜ Pending (Elite+ gate) |
| Social Export | `/social-export` | ⬜ Pending (Professional+ gate) |
| Settings | `/settings` | ⬜ Pending |

---

## PENDING WORK (MVP)

Build these in order. Each depends on the previous.

### Prompt #07 — Routines page (`/routines`)
- Routine card grid with filter by focus/goal/difficulty
- Create/Edit routine modal with exercise list builder
- WGER API integration for exercise search (`https://wger.de/api/v2/`)
- Drag-to-reorder exercises within a routine
- Assign routine to client from the routine card

### Prompt #08 — Progress page (`/progress`)
- Client selector dropdown (left panel)
- Weight + body fat line charts (Recharts, dark theme)
- Measurement history table
- Add progress record modal (weight, body fat, measurements, notes)
- Before/after photo upload (Supabase Storage)

### Prompt #09 — Analytics page (`/analytics`)
- Revenue over time area chart
- Revenue by tier pie chart
- Sessions by day of week bar chart
- Top 5 clients by revenue list
- Date range selector (week/month/quarter/year)
- KPI cards: avg session price, completion rate, projected monthly revenue

### Prompt #10 — Settings page (`/settings`)
- Profile section: name, email, avatar, business name
- Subscription section: current plan, upgrade/manage via Stripe portal
- Notification preferences
- Language selector (7 languages — next-intl, deferred to Phase 2)
- Danger zone: delete account

---

## KNOWN ISSUES / TECH DEBT

- Session times show slight timezone offset (server UTC vs browser local time) — needs timezone handling in schedule page
- `lib/travel.ts` Haversine estimate uses 25 km/h average — this is conservative for suburbs, aggressive for downtown. Acceptable for MVP.
- No pagination on clients page — will need virtual scroll at 50+ clients
- `supabase/schema.sql` was generated by Cursor and may have minor drift from actual production schema — always verify column names before writing new queries

---

## WHAT BROWSER CLAUDE HANDLES

Do not make these decisions autonomously — flag them and wait for input:

- New feature scoping or architecture changes
- Pricing or subscription tier changes
- Design system changes (new colors, new component patterns)
- Third-party service selection (new APIs, libraries)
- Legal or copy changes
- Any breaking change to the database schema

For everything else — build it, fix it, ship it.

---

## COMPANY INFO

**Albor Digital LLC**
- Wyoming, USA + Canada
- Contact: contact@albor.digital
- Other products: HR Buddy, Rental.Health, Hostalk, LynxHire, EarlyRoom
- Legal: Terms, Privacy, Disclaimer, Cookie Notice all live at `/terms`, `/privacy`, `/disclaimer`, `/cookies`
- Responsible AI Policy: AI outputs are informational, human-in-the-loop, bounded capability
