# Hourbase

> Self-hosted, open-source hour tracking for developers and freelancers.  
> Built with React + TypeScript + Tailwind + React Query + Supabase.

## Features (MVP)

- 🔐 Supabase auth (email magic link)
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
   - Paste and run the SQL found in `supabase/schema.sql`

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Then open the local URL printed in your terminal.

## Deploying to Firebase Hosting

Hourbase is a plain Vite SPA, so shipping it to Firebase Hosting is as simple as deploying the `dist/` folder you get from `npm run build`.

1. Install and log into the Firebase CLI

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. Initialize or reuse hosting config (only once per repo)

   ```bash
   firebase init hosting
   # Select your existing project: portfolio-gatsby
   # Set "dist" as the public directory, configure as SPA, skip GitHub actions unless you want CI
   ```

3. Build and deploy

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

The CLI will upload the Vite build artifacts to Firebase and wire them to the project you already have at [portfolio-gatsby](https://console.firebase.google.com/u/0/project/portfolio-gatsby/overview).

## Logging In

Hourbase uses passwordless email links via Supabase Auth:

1. From the login screen, enter your email and click **Email me a magic link**.
2. Supabase sends you a single-use link; tap it to open the app (desktop or mobile).
3. Already-signed-in sessions show in the top of the dashboard where you can sign out anytime.

Make sure the domain you deploy from (including Firebase Hosting preview URLs) is added to **Authentication → URL Configuration** inside the Supabase dashboard so magic links redirect correctly.

## Roadmap

- Auth (email / magic link)
- Projects CRUD
- Time entries with calendar view
- Dashboard with summary stats
- Export to CSV
- Multi-currency support
- Team accounts (shared projects)
- Docker compose setup for easy deployment
