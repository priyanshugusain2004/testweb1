# Android OAuth Deep Link Setup & Debug Guide

This guide provides instructions for properly configuring Google OAuth login with deep links on Android.

## 🔧 CRITICAL CONFIGURATION STEPS

### Step 1: Get Your SHA-256 Fingerprint

Your Android app needs to be registered with Google using your signing certificate fingerprint.

**For Debug Build:**
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**For Release Build:**
```bash
# Using your release keystore
keytool -list -v -keystore path/to/your/keystore.jks -alias your_key_alias
```

Copy the SHA256 fingerprint (not MD5).

### Step 2: Register Package Name & Fingerprint in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URIs:
   ```
   com.priyanshu.testweb1://auth-callback
   https://YOUR_APP_DOMAIN.com/auth-callback
   ```
6. **IMPORTANT:** For Android native OAuth, you also need to create an **Android client ID**:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Android**
   - Enter Package name: `com.priyanshu.testweb1`
   - Enter SHA-1 fingerprint: (from Step 1)
   - Accept the generated Client ID

### Step 3: Update Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and enable it
5. Set your OAuth Client ID (from Google Cloud Console)
6. Note the callback URL shown in Supabase (e.g., `https://your-project.supabase.co/auth/v1/callback`)
7. Go back to Google Cloud Console and add this URL to authorized redirect URIs

### Step 4: Update App Configuration

**capacitor.config.ts** already configured with:
```typescript
server: {
  androidScheme: 'https'
}
```

**AndroidManifest.xml** already includes:
```xml
<!-- OAuth Deep Link Handler for Google Sign-In -->
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.priyanshu.testweb1" android:host="auth-callback" />
</intent-filter>
```

### Step 5: Environment Variables

Add to your `.env` or Vercel/hosting environment:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 6: Build & Test

```bash
# Install dependencies
npm install

# Build web assets
npm run build

# Sync to Android and build APK
npm run android:build

# Or just sync without building
npm run android:test
```

## 🔍 DEBUGGING TIPS

### Check Deep Link Interception

Android Studio logcat:
```bash
adb logcat | grep -i "MainActivity\|OAuth"
```

Look for messages like:
```
D/MainActivity: Received intent with URI: com.priyanshu.testweb1://auth-callback?code=...
D/MainActivity: Processing OAuth callback
```

### Test Deep Links

```bash
# Open deep link from Android
adb shell am start -a android.intent.action.VIEW -d "com.priyanshu.testweb1://auth-callback?code=test"

# Verify custom tab closes after auth
# The Chrome Custom Tab should automatically close after redirect
```

### Browser Console Logging

In your app, enable detailed OAuth logs:
```javascript
// Add to Login.jsx for debugging
console.log('[OAuth] Initiating login...');
console.log('[OAuth] Is native app:', window.Capacitor !== undefined);
console.log('[OAuth] Is Android:', /android/i.test(navigator.userAgent));
```

### Verify Redirect Flow

The authentication flow should be:

1. User clicks "Sign in with Google" button
2. `handleGoogleLogin()` is called
3. On Android: 
   - `Browser.open()` opens OAuth URL in Chrome Custom Tab
   - User authenticates with Google
   - Google redirects to `com.priyanshu.testweb1://auth-callback?code=...`
   - Android intent filter intercepts this
   - `MainActivity.handleOAuthCallback()` is triggered
   - Code is passed to web layer via `window.oauthCallback()`
   - `handleOAuthCallback()` exchanges code for session
   - User redirected to home page

## ⚠️ COMMON ISSUES & FIXES

### Issue: "Browser gets stuck after login"
**Cause:** Missing intent filter or redirect URI mismatch
**Fix:**
- Verify `AndroidManifest.xml` has both intent filters
- Ensure `com.priyanshu.testweb1://auth-callback` is in Google Cloud authorized URIs
- Check that `window.oauthCallback` is defined before redirect

### Issue: "OAuth callback never received"
**Cause:** Android isn't intercepting the deep link
**Fix:**
- Check logcat for intent filter warnings
- Verify package name matches: `com.priyanshu.testweb1`
- Run: `adb shell dumpsys package com.priyanshu.testweb1`
- Look for intent-filter entries

### Issue: "Code exchange fails with redirect_uri_mismatch"
**Cause:** Redirect URI in code request doesn't match authorized URIs
**Fix:**
- On Android, must use: `com.priyanshu.testweb1://auth-callback`
- Verify this exact URL is registered in Google Cloud Console
- Check that Supabase redirect matches

### Issue: "App doesn't resume from browser"
**Cause:** Missing `launchMode="singleTask"` or `onNewIntent()` not implemented
**Fix:**
- `MainActivity` already has: `android:launchMode="singleTask"`
- Verify `onNewIntent()` is implemented in MainActivity.java
- Check that app-level task stack allows single instance

### Issue: "Works on web, fails on Android"
**Cause:** Different redirect URIs for web vs Android
**Fix:**
- Web: `http://localhost:5000/` (dev) or `https://app.domain.com/` (prod)
- Android: `com.priyanshu.testweb1://auth-callback` (custom scheme)
- Both must be registered in Google Cloud Console
- Login.jsx auto-detects platform and uses correct URI

## 📊 OAUTH FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────┐
│                 Android App                          │
│  ┌────────────────────────────────────────────────┐  │
│  │ Login.jsx                                      │  │
│  │ ├─ User clicks "Sign in with Google"           │  │
│  │ ├─ handleGoogleLogin() called                  │  │
│  │ ├─ Browser.open(OAuth URL) on native          │  │
│  │ └─ Awaiting redirect callback...               │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
                        │ Opens External Browser
                        │ (Chrome Custom Tab)
                        ▼
┌─────────────────────────────────────────────────────┐
│ External Chrome / Browser                            │
│ ├─ Displays Google OAuth screen                     │
│ ├─ User authenticates                               │
│ ├─ Google processes auth                            │
│ └─ Google redirects to:                             │
│    com.priyanshu.testweb1://auth-callback?code=... │
└─────────────────────────────────────────────────────┘
                        │
                        │ Android intercepts
                        │ intent-filter matching
                        ▼
┌─────────────────────────────────────────────────────┐
│                 Android OS                           │
│ ├─ Checks manifest for scheme handler               │
│ ├─ Finds: android:scheme="com.priyanshu.testweb1"  │
│ ├─ Launches MainActivity with deep link intent     │
│ └─ Passes URI to app...                             │
└─────────────────────────────────────────────────────┘
                        │
                        │ Routes via onNewIntent()
                        ▼
┌─────────────────────────────────────────────────────┐
│ MainActivity.java                                    │
│ ├─ onNewIntent() called                             │
│ ├─ handleOAuthCallback(uri) processes deep link     │
│ ├─ Extracts code and state from URI                 │
│ ├─ Calls window.oauthCallback() on web layer       │
│ └─ App receives auth code...                        │
└─────────────────────────────────────────────────────┘
                        │
                        │ Calls window.oauthCallback()
                        │ in JavaScript context
                        ▼
┌─────────────────────────────────────────────────────┐
│ Login.jsx - handleOAuthCallback()                    │
│ ├─ Receives code and state                          │
│ ├─ Calls supabase.auth.exchangeCodeForSession()    │
│ ├─ Server validates code and issues JWT token      │
│ ├─ Session established in local storage            │
│ ├─ AuthContext updated                              │
│ └─ navigate('/') redirects to home                  │
└─────────────────────────────────────────────────────┘
                        │
                        │ User authenticated
                        │ App resumed
                        ▼
          ✅ SUCCESS: User logged in
```

## 🧪 TESTING CHECKLIST

- [ ] Build APK and install on Android device/emulator
- [ ] Click "Sign in with Google" button
- [ ] External browser/Chrome Tab opens
- [ ] Can authenticate with Google credentials
- [ ] After auth, browser automatically closes
- [ ] App resumes automatically to home screen
- [ ] User is logged in (can see profile data)
- [ ] Refresh page, still logged in (session persisted)
- [ ] Logout and login again works
- [ ] Deep link test: `adb shell am start -a android.intent.action.VIEW -d "com.priyanshu.testweb1://auth-callback?code=xyz"`
- [ ] No errors in Android Studio logcat
- [ ] No network errors in browser DevTools

## 📝 ADDITIONAL REFERENCES

- [Capacitor Browser Plugin Docs](https://capacitorjs.com/docs/apis/browser)
- [Supabase OAuth for Capacitor](https://supabase.com/docs/guides/auth/phone-auth/oauth)
- [Android App Links Verification](https://developer.android.com/training/app-links/verify-app-links)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Android Intent Filters](https://developer.android.com/guide/components/intents-filters)
