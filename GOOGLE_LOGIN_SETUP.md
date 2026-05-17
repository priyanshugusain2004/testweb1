# Google Login Setup Guide

Your app is now configured for **Google OAuth login**. Follow these steps to enable it:

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:5000/` (for local testing)
   - `https://[your-app].supabase.co/auth/v1/callback` (replace with your Supabase URL)
   - `https://[your-domain].com/` (your production domain)
7. Copy the **Client ID**

## Step 2: Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and click to enable
5. Paste your **Client ID** from Google Cloud Console
6. Copy the **Callback URL** shown in Supabase
7. Go back to Google Cloud Console and add this callback URL to authorized redirect URIs

## Step 3: Update Environment Variables

In your `.env` file (or Vercel/hosting platform):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Test Locally

```bash
cd web
npm run dev
```

Visit `http://localhost:5000/` and click **Sign in with Google**

---

## 🚀 Deployment to Vercel

After setting up Google OAuth:

1. Push code to GitHub:
```bash
git add .
git commit -m "Add Google OAuth login"
git push origin main
```

2. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy

3. In Google Cloud Console, add your Vercel domain to authorized redirect URIs:
   - `https://[your-project].vercel.app/`

---

## 📝 Demo Mode

If Supabase is not configured, the app runs in **Demo Mode** with mock data:
- No Google login needed
- Automatically logs in as "Alex Rivera"
- Perfect for testing UI/functionality

To disable demo mode and force Google login, remove mock session from `src/lib/mockData.js`

---

## 🆘 Troubleshooting

**"Google sign-in not working"**
- Check that Callback URL in Supabase matches Google Cloud Console
- Verify Client ID is correctly pasted in Supabase

**"Redirect URI mismatch"**
- Make sure all authorized URIs are added in Google Cloud Console
- Use exact URLs (including protocol and trailing slash)

**"User profile not created"**
- After first Google login, you may need to create a `participants` record
- Add a trigger in Supabase to auto-create participant profile on signup

---

## ✨ Features

✅ One-click Google login  
✅ Works on desktop & mobile  
✅ Demo mode fallback  
✅ Secure OAuth 2.0 flow  
✅ Automatic user session management
