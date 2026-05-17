# Activity Tracker Web App

A React + Vite web application with Supabase integration, featuring authentication, activity logging, leaderboards, and progress tracking.

## Getting Started

### Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5000`

### Build
```bash
npm run build
npm run preview  # Preview production build locally
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from your [Supabase Dashboard](https://supabase.com/dashboard)

## Deployment to Vercel (Free)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Set Environment Variables:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key
5. Click "Deploy"

**Live URL:** `https://your-project.vercel.app`

### Step 3: Setup Custom Domain (Optional)
In Vercel Dashboard → Settings → Domains

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

## Tech Stack

- React 19
- Vite 8
- React Router v7
- Supabase (Database + Auth)
- Lucide React (Icons)
- Recharts (Charting)

## Features

- **Google OAuth Login** (one-click sign-in)
- User Authentication (Supabase Auth)
- Activity Logging
- Leaderboards
- Progress Tracking
- Real-time Data Sync
- Demo Mode (without Supabase credentials)

## Google Login Setup

See [GOOGLE_LOGIN_SETUP.md](../GOOGLE_LOGIN_SETUP.md) for detailed setup instructions with Google Cloud Console and Supabase configuration.
