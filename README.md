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

### Frontend

- **React 19.2.0** - UI library with modern hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite 7.2.2** - Fast build tool and dev server
- **React Router 7.9.6** - Client-side routing
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### State Management & Data Fetching

- **TanStack React Query 5.90.10** - Server state management, caching, and synchronization
- **React Context API** - Client-side state (Auth, Toast notifications)

### Backend & Database

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email magic links)
  - Row Level Security (RLS) policies
  - Real-time subscriptions (ready for future features)

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/stefansukara/hourbase.git
   cd hourbase
   ```

   Or if you've forked the repository:

   ```bash
   git clone https://github.com/your-username/hourbase.git
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

   Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

   Or create it manually with:

   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Fill in the values from your Supabase project dashboard.

5. **Apply database schema**
   - Open the Supabase SQL editor
   - Paste and run the SQL found in `supabase/schema.sql`

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Then open the local URL printed in your terminal.

## Deployment

Hourbase can be deployed to various hosting platforms. Here are the recommended options:

### Option 1: Vercel

**Why Vercel?**

- ✅ **Zero configuration** - Auto-detects Vite/React settings
- ✅ **GitHub integration** - Automatic deployments on every push
- ✅ **Preview deployments** - Every PR gets a preview URL
- ✅ **Free SSL** - Automatic HTTPS certificates
- ✅ **Global CDN** - Fast worldwide performance
- ✅ **Environment variables** - Easy management via dashboard

**Quick Deploy via GitHub:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" → Import your repository
4. Vercel auto-detects Vite settings
5. Add environment variables in the dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy" → Done!

**Custom Domain:**

- After deployment, add your custom domain in Vercel dashboard
- Vercel provides DNS records to add to your registrar
- SSL is automatically provisioned

**Deploy via CLI:**

```bash
npx vercel
```

### Option 2: Firebase Hosting

Perfect if you're already using Firebase or want to host multiple sites in one project.

**Quick Deploy:**

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Hosting**

   ```bash
   firebase init hosting
   ```

   - Select your Firebase project
   - Set `dist` as the public directory
   - Configure as a single-page app

3. **Create `.env.production`** with your Supabase credentials:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Build and deploy**

   ```bash
   npm run build
   firebase deploy --only hosting:hourbase
   ```

5. **Add custom domain** in Firebase Console → Hosting

**Multi-Site Setup:**
Firebase supports hosting multiple sites in one project. See `DEPLOYMENT.md` for detailed multi-site configuration.

### Other Options

- **Netlify** - Similar to Vercel, great GitHub integration
- **Cloudflare Pages** - Fast CDN, free tier available
- **Self-hosted** - Deploy to your own server with Nginx

### Post-Deployment

**Update Supabase Auth Settings:**

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your production URL to:
   - **Redirect URLs**: `https://your-domain.com/**`
   - **Site URL**: `https://your-domain.com`

**See `DEPLOYMENT.md`** for comprehensive deployment guides, architecture details, and troubleshooting.

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
