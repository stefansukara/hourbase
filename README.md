# Hourbase

> Self-hosted, open-source hour tracking for developers and freelancers.  
> Built with React + TypeScript + Tailwind + React Query + Supabase.

## Features (MVP)

- 🔐 Supabase auth (email / magic link)
- 👥 Projects (clients) with hourly rate and currency
- 📅 Calendar-style log of hours per day per project
- 💰 Automatic calculation of earned amount per day / project
- 📊 Simple dashboard: hours + earnings summary

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- TanStack React Query
- Supabase (auth + Postgres)
- React Router

## Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/<your-username>/hourbase.git
   cd hourbase
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a Supabase project**
   - Go to the Supabase dashboard
   - Create a new project
   - Copy the Project URL and anon public key

4. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your project values.

5. **Apply database schema**
   - Open the Supabase SQL editor
   - Paste and run the SQL found in `supabase/schema.sql` (to be added)

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Then open the local URL printed in your terminal.

## Roadmap

- Auth (email / magic link)
- Projects CRUD
- Time entries with calendar view
- Dashboard with summary stats
- Export to CSV
- Multi-currency support
- Team accounts (shared projects)
- Docker compose setup for easy deployment

---

If you want, next step I can do is:

1. Implement **auth flow with Supabase** (hooks + context)
2. Add **project list + create form** wired to Supabase with React Query
3. Skeleton **CalendarPage** with day view where you can log hours

Tell me what you want **first in Cursor**: 👉 auth, projects CRUD, or time entry calendar?
