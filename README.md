# Zorvyn — Frontend Developer Assignment

**Submission for Frontend Developer Role**  
**Live Demo:** [https://finance-dashboard-ui-liard.vercel.app/](https://finance-dashboard-ui-liard.vercel.app/)

---

## 🎯 Project Objective

To build a clean, interactive, and high-performance finance dashboard that demonstrates a deep understanding of modern frontend development, state management, and user experience design. This project focuses on intuitive navigation, data visualization, and robust data handling.

---

## ✨ Assignment Checklist & Fulfillment

### 1. Dashboard Overview
- [x] **Summary Cards:** 4 animated cards (Balance, Income, Expenses, Savings) with spring-based counters.
- [x] **Data Visualizations:** Balance Trend (Area Chart) and Spending Breakdown (Donut Chart) using Recharts.
- [x] **Recent Activity:** A quick-view table of latest transactions with staggered entry animations.

### 2. Transaction Management
- [x] **Full CRUD:** Add, Edit, and Delete transactions with a consistent Dialog-based interface.
- [x] **Advanced Filtering:** Debounced search + Category filter + Type filter (Income/Expense).
- [x] **Data Table:** Responsive table with column sorting (Date, Amount, Category).
- [x] **Data Export:** Export current transactions to **CSV** (Excel-ready) or **JSON**.

### 3. Role-Based UI (RBAC)
- [x] **Role Switcher:** Toggle between **Admin** and **Viewer** in the TopBar.
- [x] **Permission Logic:**
    - **Admin:** Full access to CRUD actions and Data Reset.
    - **Viewer:** Read-only access; "Add" and "Delete" buttons are hidden/disabled across the app.

### 4. Insights & Analytics
- [x] **Financial Intelligence:** Dedicated page showing MoM growth, highest spending categories, and average daily spend.
- [x] **Savings Tracker:** Interactive SVG progress ring with dynamic messaging.

### 5. Mandatory Enhancements
- [x] **Dark Mode:** System-aware theme switching via `next-themes`.
- [x] **Data Persistence:** Persistent storage using Zustand's `persist` middleware (localstorage).
- [x] **Animations:** Advanced physics-based transitions using Framer Motion (staggered lists, viewport triggers).
- [x] **Mock API:** Simulated network latency (300ms) with proper loading/skeleton states.

---

## 🛠️ Technical Stack

- **Framework:** Next.js 16 (App Router) with Turbopack.
- **Styling:** Tailwind CSS v4 (using OKLCH color space for better contrast).
- **State:** Zustand (Selector-based for 0 sub-component re-renders).
- **UI Primitives:** shadcn/ui (Radix UI) for accessibility compliance.
- **Icons:** Lucide React.
- **Charts:** Recharts (responsive & theme-aware).

---

## 🏛️ Engineering Decisions

### Modern Navigation Dock
I replaced the traditional sidebar with a **Responsive Navigation Dock**. 
- **Desktop:** A sleek vertical strip on the left with high-contrast active icons and glassmorphism tooltips.
- **Mobile:** A floating bottom navigation bar, optimized for thumb-reach and native app feel.

### Optimized Rehydration
To handle persistence without hydration mismatches, I implemented an `isHydrated` state check. This ensures that the UI only renders once the local storage data is verified, preventing "flicker" and ensuring data consistency.

### Accessibility & UX
- **Skeleton States:** Every chart and table has a matching skeleton state to prevent Layout Shift (CLS).
- **Semantic Colors:** Used a custom Indigo/Emerald/Rose palette for financial sentiment (Success/Destructive).
- **Responsive Layout:** The App Shell dynamically shifts from a 2-column Desktop layout to a single-column Mobile layout with zero layout breakage.

---

## 🚀 How to Run Locally

```bash
# 1. Clone & Install
git clone https://github.com/ashutosh-kumar/zorvyn.git
cd zorvyn
pnpm install

# 2. Run Dev (Turbopack)
pnpm dev

# 3. Production Build
pnpm build
pnpm start
```

---

## 📝 Self-Evaluation
This submission fulfills 100% of the core requirements and 100% of the mandatory enhancements. It prioritizes **visual excellence** and **code quality**, utilizing the latest stable versions of Next.js and Tailwind.
