# Zorvyn — Finance Dashboard UI

A clean, interactive finance dashboard built to demonstrate frontend development skills. Tracks spending, visualizes financial data, and manages transactions with a role-based UI.

> **Live:** Run locally with `pnpm dev` → [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework, routing, server components |
| **TypeScript** | Type-safe development with strict patterns |
| **Tailwind CSS v4** | Utility-first styling with OKLCH color tokens |
| **shadcn/ui** (radix-nova) | Accessible, composable UI primitives |
| **Zustand** | Lightweight state management with persist middleware |
| **Recharts** | Data visualization (Area, Pie, Bar charts) |
| **Framer Motion** | Physics-based animations and transitions |
| **Sonner** | Toast notifications |

---

## Features

### Core Requirements

- [x] **Dashboard Overview** — 4 animated summary cards + Balance Trend area chart + Spending Breakdown donut chart + Recent Transactions table
- [x] **Transaction Management** — Full CRUD with sortable table, debounced search, multi-filter (category, type, date range), clear-all reset
- [x] **Role-Based UI** — Admin (full CRUD) / Viewer (read-only) toggle with immediate effect — no page reload needed
- [x] **Insights & Analytics** — Highest spending category, month-over-month change, average daily spend, monthly income vs expenses comparison, savings goal tracker
- [x] **State Management** — Zustand with shallow selectors, `persist` middleware for localStorage, `isHydrated` flag for SSR safety
- [x] **UI/UX** — Responsive design (mobile → tablet → desktop), skeleton loading states, empty states, semantic colors, accessible forms

### All Enhancements (Mandatory)

- [x] **Dark Mode** — System-aware + manual toggle via `next-themes`
- [x] **Data Persistence** — Transactions + role saved to localStorage, auto-reseed on clear
- [x] **Mock API** — Async wrappers with simulated network delays + proper loading/error handling
- [x] **Framer Motion Animations** — Staggered card reveals, animated number counters, table row enter/exit, chart viewport fade-in, SVG ring animation
- [x] **Export CSV/JSON** — One-click download with BOM-encoded CSV for Excel compatibility
- [x] **Advanced Filtering** — Multi-filter combo (search + category + type + date range) with active filter count badge

---

## Architecture Decisions

### Why Zustand over Context?
- Built-in `persist` middleware handles localStorage with zero boilerplate
- Selector-based subscriptions prevent unnecessary re-renders (each component reads only what it needs)
- No provider nesting — cleaner component tree
- Less code than Context + useReducer for the same functionality

### Why Framer Motion over CSS Animations?
- Physics-based springs feel more natural than linear/ease CSS curves
- `AnimatePresence` enables mount/unmount transitions (table rows appearing/disappearing)
- `whileInView` triggers animations on scroll (charts fade in when visible)
- `useReducedMotion()` respects accessibility preferences
- Shared variant objects in `lib/motion.ts` ensure consistency across all components

### Why shadcn/ui?
- Pre-built accessible components (keyboard navigation, ARIA attributes, focus management)
- Composable primitives (Card, Table, Dialog, Select) that own their styling
- Consistent design language with semantic color tokens
- Components live in the project (`components/ui/`) — full control, no external dependency lock-in

---

## Setup Instructions

```bash
# Prerequisites: Node.js 18+ and pnpm

# Clone and install
git clone <repo-url>
cd zorvyn
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm run build
pnpm start
```

---

## Project Structure

```
zorvyn/
├── app/
│   ├── globals.css                        # Theme tokens + custom OKLCH colors
│   ├── layout.tsx                         # Root layout (providers, sidebar, header)
│   ├── page.tsx                           # Dashboard Overview (server component)
│   ├── transactions/page.tsx              # Transactions CRUD (client component)
│   └── insights/page.tsx                  # Insights & Analytics (server component)
│
├── components/
│   ├── layout/                            # Sidebar, Header, RoleSwitcher
│   ├── dashboard/                         # Summary cards, charts, recent table
│   ├── transactions/                      # Filters, sortable table, dialog, export
│   ├── insights/                          # Insight cards, charts, savings goal
│   ├── providers/                         # ThemeProvider
│   └── ui/                               # shadcn-managed primitives (24 components)
│
├── lib/
│   ├── types.ts                           # All TypeScript interfaces (0 `any`)
│   ├── constants.ts                       # Categories, formatters, defaults
│   ├── motion.ts                          # Framer Motion shared variants
│   ├── store.ts                           # Zustand store with persist
│   ├── data/seed-transactions.ts          # 38 mock transactions (Jan–Jun 2026)
│   └── api/finance.ts                     # Mock API with simulated delays
│
└── hooks/
    ├── use-filtered-transactions.ts       # Derived filtered/sorted data
    ├── use-animated-number.ts             # Spring-based number counting
    └── use-export.ts                      # CSV/JSON download
```

---

## State Management

```
┌─────────────────────────────────────────────┐
│              Zustand Store                   │
│                                              │
│  transactions[]  ← CRUD actions             │
│  filters         ← setFilter, resetFilters  │
│  role            ← setRole                   │
│  sortField       ← setSort (toggles order)  │
│  sortOrder                                   │
│  isHydrated      ← prevents SSR mismatch    │
│                                              │
│  persist → localStorage "zorvyn-finance-v1"  │
│  only: transactions, role                    │
└─────────────────────────────────────────────┘
```

**Key patterns:**
- Individual selectors: `useFinanceStore((s) => s.transactions)` — only re-renders when that slice changes
- `useMemo` for all derived data (filtered lists, chart aggregations, insights)
- `useCallback` for stable event handler references
- `isHydrated` flag renders `Skeleton` until Zustand rehydrates from localStorage

---

## Design Decisions

- **Indigo accent** (`oklch(0.585 0.233 277)`) — conveys trust and professionalism for finance
- **OKLCH color space** — perceptually uniform colors, consistent across light/dark themes
- **Vibrant chart palette** — indigo, emerald, amber, rose, sky (not default grays)
- **Flat file structure** — single `types.ts`, `store.ts`, `constants.ts` for easy navigation
- **Responsive breakpoints** — Mobile (<640px): stacked, hidden sidebar. Tablet (640–1024px): 2-col cards, collapsed sidebar. Desktop (>1024px): 4-col cards, expanded sidebar.

---

## Code Quality Highlights

- **Zero `any` types** — strict TypeScript throughout
- **Custom hooks** separate all business logic from components
- **Singleton formatters** — `Intl.NumberFormat` and `Intl.DateTimeFormat` instances reused (not recreated per render)
- **`as const satisfies`** — type-safe static config arrays
- **Debounced search** — 300ms via `useEffect` + `setTimeout` cleanup (no external lib)
- **BOM-encoded CSV** — UTF-8 BOM prefix for Excel compatibility

---

## Edge Cases Handled

| Edge Case | Solution |
|---|---|
| Hydration mismatch | `isHydrated` flag → Skeleton until rehydrated |
| Empty transactions | Empty component with CTA (admin: "Add Transaction") |
| Filters match nothing | Empty component + "Clear filters" button |
| Very large amounts | `Intl.NumberFormat` with INR locale (lakhs/crores) |
| Long descriptions | `truncate` class on table cells |
| localStorage cleared | Auto-reseeds with mock data on next load |
| Dark mode charts | CSS variable colors that auto-swap |
| Role switch mid-view | Immediate effect — no page reload |
| Zero savings | Progress ring shows 0% with encouraging message |
| Reduced motion | `useReducedMotion()` → instant transitions |

---

## Optional Improvements (Future)

- [ ] Pagination for large transaction lists
- [ ] Drag-to-reorder dashboard widgets
- [ ] Multi-currency support
- [ ] Backend API integration
- [ ] E2E tests with Playwright
