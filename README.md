# testweb1

This repository contains a Vite + React web app prepared for Capacitor Android packaging.

Quick build & CI

- Install dependencies locally:

	npm install

- (Optional) Install/upgrade Capacitor packages locally:

	npm install @capacitor/cli @capacitor/core @capacitor/android --save-dev
	npm install @capacitor/splash-screen @capacitor/keyboard @capacitor/status-bar @capacitor/app --save

- Build web assets:

	npm run build

- Add / sync Android platform locally (only if you want to edit native project):

	npx cap add android || true
	npx cap sync android

- Build APK locally (requires JDK 17):

	cd android
	./gradlew assembleDebug

Github Actions

- A workflow at `.github/workflows/android-apk.yml` builds the web app, syncs Capacitor, builds the Android debug APK with Java 17 and Android SDK 34, and uploads the APK as an artifact named `app-debug-apk` on every push to `main`.

Notes & fixes applied

- Added mobile viewport and PWA meta tags to improve mobile rendering and safe-area support.
- Enabled `android:windowSoftInputMode="adjustResize|stateHidden"` to reduce keyboard overlap.
- Initialized Capacitor Keyboard resize mode to help input fields avoid occlusion.
- Configured the SplashScreen plugin in `capacitor.config.ts`.
- Added Java 17 compile options in `android/app/build.gradle` for compatibility with Gradle/AGP.

Play Store readiness checklist

- Replace debug signing with a release keystore and sign the APK using Gradle (`assembleRelease`).
- Configure versionCode/versionName and proper appId in `capacitor.config.ts` and `android/app/build.gradle`.
- Verify privacy policy, content rating, and required permissions.
- Test across Android API levels and devices; enable proguard/minification for release builds.
- Integrate app signing with GitHub Secrets for automated signed release builds.

If you want, I can:
- Add automated signed release pipeline (requires GH secrets for keystore and passwords).
- Tweak UI/UX for mobile-first responsiveness in specific pages.