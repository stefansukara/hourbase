# Deployment Guide: Hourbase to Firebase Hosting

This document describes the complete deployment process for Hourbase, a React + TypeScript time tracking application, to Firebase Hosting as a subdomain of an existing personal portfolio site.

## Architecture Overview

The deployment leverages **Firebase Hosting's multi-site feature** to host two separate applications within the same Firebase project:

- **Primary Site**: Personal portfolio (`stefansukara.com`) - Built with Gatsby, deployed to Firebase Hosting
- **Secondary Site**: Hourbase application (`hourbase.stefansukara.com`) - Built with Vite + React, deployed as a separate hosting site

This approach provides:

- **Cost efficiency**: Single Firebase project for multiple applications
- **Independent deployments**: Each site can be deployed separately without affecting the other
- **Unified domain management**: Both sites under the same domain with subdomain routing
- **Simplified infrastructure**: One hosting provider, one project, multiple sites

## Prerequisites

- Existing Firebase project with a primary site already deployed (in this case, `stefansukara.com` using Gatsby)
- Firebase CLI installed and authenticated
- Supabase project with database schema applied
- Domain DNS access for `stefansukara.com`

## Step-by-Step Deployment Process

### 1. Firebase Project Setup

Since the Firebase project already exists with the primary site (`stefansukara.com`), we leverage the existing project infrastructure.

**Initialize Firebase Hosting in the Hourbase project:**

```bash
firebase init hosting
```

**Configuration choices:**

- Select existing Firebase project (the one hosting `stefansukara.com`)
- Public directory: `dist` (Vite build output)
- Configure as single-page app: **Yes** (required for React Router client-side routing)
- Set up automatic builds and deploys with GitHub: **No** (optional, can be added later)

This creates:

- `firebase.json` - Hosting configuration
- `.firebaserc` - Project and target mappings

### 2. Multi-Site Configuration

To enable independent deployments for both sites, we configure Firebase Hosting with multiple sites using targets.

**Update `firebase.json`:**

```json
{
  "hosting": [
    {
      "target": "hourbase",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "**/*.@(js|css|woff|woff2|ttf|eot)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=31536000"
            }
          ]
        }
      ]
    }
  ]
}
```

**Key configuration decisions:**

- **Target**: `hourbase` - Logical name for this hosting site
- **Public directory**: `dist` - Vite's production build output
- **Rewrites**: All routes (`**`) redirect to `/index.html` - Essential for React Router SPA routing
- **Cache headers**: Long-term caching for static assets (JS, CSS, fonts) to improve performance

**Create hosting target:**

```bash
firebase target:apply hosting hourbase hourbase-site
```

This command:

- Creates a new hosting site named `hourbase-site` in Firebase
- Maps the logical target `hourbase` to the physical site `hourbase-site`
- Updates `.firebaserc` with the target mapping

**Result in `.firebaserc`:**

```json
{
  "projects": {
    "hourbase": "portfolio-gatsby"
  },
  "targets": {
    "portfolio-gatsby": {
      "hosting": {
        "hourbase": ["hourbase-site"]
      }
    }
  }
}
```

### 3. Environment Configuration

Since Firebase Hosting serves static files, environment variables must be baked into the build at build time.

**Create `.env.production`:**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important considerations:**

- Vite uses the `VITE_` prefix for environment variables exposed to the client
- These values are embedded in the JavaScript bundle during build
- The Supabase anon key is safe to expose publicly (it's designed for client-side use)
- Never commit `.env.production` to version control (already in `.gitignore`)

### 4. Build and Deploy

**Build the application:**

```bash
npm run build
```

This command:

- Runs TypeScript compilation (`tsc -b`)
- Executes Vite build process
- Outputs optimized production bundle to `dist/` directory
- Embeds environment variables from `.env.production`

**Deploy to Firebase:**

```bash
firebase deploy --only hosting:hourbase
```

**Deployment process:**

- Uploads `dist/` contents to Firebase Hosting
- Deploys specifically to the `hourbase-site` (not affecting the primary site)
- Provides a temporary Firebase URL (e.g., `hourbase-site.web.app`)
- SSL certificate is automatically provisioned

**Deployment output:**

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/portfolio-gatsby/overview
Hosting URL: https://hourbase-site.web.app
```

### 5. Custom Domain Configuration

**Add custom domain in Firebase Console:**

1. Navigate to Firebase Console → Hosting
2. Select the `hourbase-site` (not the primary site)
3. Click "Add custom domain"
4. Enter: `hourbase.stefansukara.com`
5. Firebase provides DNS records (typically A records with IP addresses)

**DNS Configuration:**

In your domain registrar's DNS settings, add the records provided by Firebase:

```
Type: A
Name: hourbase
Value: [IP addresses provided by Firebase]
TTL: 3600 (or default)
```

**DNS Propagation:**

- Changes typically propagate within 5-30 minutes
- Can take up to 48 hours in rare cases
- Use `dig hourbase.stefansukara.com` or online DNS checkers to verify

**SSL Certificate:**

- Firebase automatically provisions SSL certificates via Let's Encrypt
- Certificate is automatically renewed
- HTTPS is enforced by default

### 6. Supabase Authentication Configuration

For Supabase magic link authentication to work with the production domain, we must configure allowed redirect URLs.

**Configure in Supabase Dashboard:**

1. Navigate to: **Authentication** → **URL Configuration**
2. **Site URL**: Set to `https://hourbase.stefansukara.com`
3. **Redirect URLs**: Add the following (one per line):
   ```
   https://hourbase.stefansukara.com
   https://hourbase.stefansukara.com/**
   http://localhost:5173
   http://localhost:5173/**
   ```

**Why both patterns?**

- Exact domain match: `https://hourbase.stefansukara.com` - For root path redirects
- Wildcard pattern: `https://hourbase.stefansukara.com/**` - For all sub-paths (e.g., `/dashboard`, `/calendar`)
- Localhost URLs: For local development environment

**Security considerations:**

- Only add domains you control
- The `/**` pattern allows all paths, which is necessary for React Router's client-side routing
- Supabase validates redirect URLs to prevent open redirect vulnerabilities

## Deployment Workflow

### Initial Deployment (One-time setup)

```bash
# 1. Initialize Firebase (if not done)
firebase init hosting

# 2. Create hosting target
firebase target:apply hosting hourbase hourbase-site

# 3. Create environment file
echo "VITE_SUPABASE_URL=your_url" > .env.production
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env.production

# 4. Build and deploy
npm run build
firebase deploy --only hosting:hourbase

# 5. Add custom domain in Firebase Console
# 6. Update DNS records
# 7. Configure Supabase Auth URLs
```

### Subsequent Deployments

For future updates, the workflow is simplified:

```bash
npm run build
firebase deploy --only hosting:hourbase
```

**Deployment characteristics:**

- **Zero downtime**: Firebase uses atomic deployments
- **Instant rollback**: Previous version remains available
- **CDN propagation**: Changes propagate globally within minutes
- **Independent**: Does not affect the primary `stefansukara.com` site

## Multi-Site Management

### Deploying Hourbase

```bash
cd /path/to/hourbase
npm run build
firebase deploy --only hosting:hourbase
```

### Deploying Portfolio Site (Gatsby)

```bash
cd /path/to/gatsby-portfolio
npm run build
firebase deploy --only hosting:gatsby-site
```

(Replace `gatsby-site` with your actual Gatsby hosting target name)

### Benefits of Multi-Site Architecture

1. **Isolation**: Each application is independent
2. **Independent versioning**: Deploy one without affecting the other
3. **Separate analytics**: Firebase provides per-site analytics
4. **Flexible scaling**: Each site can have different configurations
5. **Cost optimization**: Single project, multiple sites

## Verification and Testing

### Post-Deployment Checklist

- [ ] Application loads at `https://hourbase.stefansukara.com`
- [ ] React Router navigation works (no 404s on direct URL access)
- [ ] Supabase connection established (check browser console for errors)
- [ ] Authentication flow works (magic link login)
- [ ] All routes accessible (Dashboard, Projects, Calendar)
- [ ] HTTPS enforced (no HTTP redirects)
- [ ] SSL certificate valid (green lock icon in browser)

### Testing Authentication

1. Navigate to `https://hourbase.stefansukara.com`
2. Click "Email me a magic link"
3. Enter email address
4. Check email and click magic link
5. Verify redirect to production domain (not localhost)
6. Confirm successful authentication

## Troubleshooting

### Common Issues

**Issue: "Invalid redirect URL" error**

- **Solution**: Verify Supabase Auth URLs include both exact and wildcard patterns

**Issue: 404 errors on direct URL access**

- **Solution**: Verify `firebase.json` has the rewrite rule: `"source": "**", "destination": "/index.html"`

**Issue: Environment variables not working**

- **Solution**: Ensure `.env.production` exists and variables are prefixed with `VITE_`

**Issue: DNS not resolving**

- **Solution**: Check DNS propagation with `dig hourbase.stefansukara.com` or online tools
- **Solution**: Verify DNS records match Firebase-provided values exactly

**Issue: Mixed content warnings**

- **Solution**: Ensure all API calls use HTTPS (Supabase URLs are HTTPS by default)

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│         Firebase Project: portfolio-gatsby       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │  Hosting Site 1  │    │  Hosting Site 2  │  │
│  │                  │    │                  │  │
│  │  gatsby-site     │    │  hourbase-site   │  │
│  │                  │    │                  │  │
│  │  stefansukara.com│    │hourbase.stefan...│  │
│  │  (Gatsby)        │    │  (Vite + React)  │  │
│  └──────────────────┘    └──────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
         │                          │
         │                          │
         ▼                          ▼
┌─────────────────┐      ┌──────────────────────┐
│  Domain DNS     │      │   Supabase Project   │
│  stefansukara.com│      │   (Backend + Auth)   │
└─────────────────┘      └──────────────────────┘
```

## Technology Stack

- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router 7.9.6
- **State Management**: TanStack React Query 5.90.10
- **Styling**: Tailwind CSS 3.4.14
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Firebase Hosting (multi-site)
- **Domain**: Custom domain with subdomain routing

## Conclusion

This deployment strategy demonstrates a production-ready approach to hosting multiple applications under a single domain using Firebase Hosting's multi-site feature. The architecture provides:

- **Scalability**: Easy to add more subdomains/applications
- **Maintainability**: Clear separation of concerns
- **Cost efficiency**: Single Firebase project for multiple sites
- **Developer experience**: Simple deployment workflow
- **Production readiness**: SSL, CDN, and global distribution included

The application is now live at [https://hourbase.stefansukara.com](https://hourbase.stefansukara.com) and fully integrated with Supabase for authentication and data persistence.
