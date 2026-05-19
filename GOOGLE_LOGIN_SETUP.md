# Google Login Setup Guide

Your app is now configured for **Google OAuth login**. Follow these steps to enable it:

## 📱 ANDROID SETUP (MOST IMPORTANT)

⚠️ **READ THIS FIRST** if you're building for Android!

### Quick Android Setup
1. See [ANDROID_OAUTH_SETUP.md](./ANDROID_OAUTH_SETUP.md) for complete Android OAuth configuration
2. Get your SHA-256 fingerprint using keytool
3. Register Android Client ID in Google Cloud Console
4. Update `com.priyanshu.testweb1://auth-callback` in Google Console authorized URIs

### Why Android Needs Special Configuration
- Android apps need custom URL schemes to receive OAuth callbacks
- Browser alone can't return control to the app
- Intent filters intercept deep links and route them back to the app
- Follow the Android guide for proper deep link setup

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
   - `com.priyanshu.testweb1://auth-callback` (Android custom scheme)
7. Copy the **Client ID**

**For Android Only:**
- Also create an **Android Client ID** in Google Cloud Console
- Enter your package name: `com.priyanshu.testweb1`
- Enter your SHA-256 fingerprint (see ANDROID_OAUTH_SETUP.md)

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

## Step 4: Test Locally (Web)

```bash
cd web
npm run dev
```

Visit `http://localhost:5000/` and click **Sign in with Google**

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

## 📱 Building for Android

After configuring OAuth (steps above):

```bash
# Build web
npm run build

# Sync to Android and build APK
npm run android:build

# Or just sync
npm run android:test
```

**Important:** See [ANDROID_OAUTH_SETUP.md](./ANDROID_OAUTH_SETUP.md) for:
- SHA-256 fingerprint setup
- Deep link configuration
- Debugging tips
- Common issues and fixes

## 📝 Demo Mode

If Supabase is not configured, the app runs in **Demo Mode** with mock data:
- No Google login needed
- Automatically logs in as "Alex Rivera"
- Perfect for testing UI/functionality

To disable demo mode and force Google login, remove mock session from `src/lib/mockData.js`

## 🆘 Troubleshooting

### Web Issues

**"Google sign-in not working"**
- Check that Callback URL in Supabase matches Google Cloud Console
- Verify Client ID is correctly pasted in Supabase

**"Redirect URI mismatch"**
- Make sure all authorized URIs are added in Google Cloud Console
- Use exact URLs (including protocol and trailing slash)

**"User profile not created"**
- After first Google login, you may need to create a `participants` record
- Add a trigger in Supabase to auto-create participant profile on signup

### Android Issues

See [ANDROID_OAUTH_SETUP.md](./ANDROID_OAUTH_SETUP.md) for Android-specific troubleshooting including:
- Browser stuck after login
- OAuth callback never received
- Code exchange fails
- App doesn't resume from browser

## ✨ Features

✅ One-click Google login  
✅ Works on desktop & mobile (including Android with deep links)  
✅ Demo mode fallback  
✅ Secure OAuth 2.0 flow  
✅ Automatic user session management  
✅ Android app resumption after OAuth  

## 🔗 References

- [Capacitor Browser Plugin](https://capacitorjs.com/docs/apis/browser)
- [Supabase OAuth Guide](https://supabase.com/docs/guides/auth/phone-auth/oauth)
- [Android App Links](https://developer.android.com/training/app-links/verify-app-links)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
