# Attendance Buddy

A mobile-first attendance tracker for students, built with React, TypeScript, Vite, and Supabase. The same responsive website works on Android, iOS, tablets, and desktop browsers; the included web manifest and service worker support installing the site as a PWA.

## Features

- Email/password sign-up, sign-in, and sign-out.
- Cloud sync for each user's own timetable, attendance, holidays, profile, and settings.
- Row Level Security (RLS) prevents users from reading or changing another user's attendance workspace.
- Attendance defaults: present, absent, or manual.
- One-tap absent/present toggles and explicit blank status in manual mode.
- Separate percentages by subject and category; theory defaults to 75%, practical/clinical to 80%.
- Forward-looking estimate of the maximum number of future classes that can be missed while meeting a threshold, assuming all other future sessions are attended.
- Editable weekly timetable with add/remove class actions.
- College holidays excluded from attendance calculations.
- Configurable tracking start and academic-year end date (default 31 July 2027).
- Optional student directory; visibility is off by default and only opted-in name/course/year are listed. Email and attendance are not displayed.
- JSON backup/restore.
- Installable PWA shell and in-app browser notifications for manual-mode classes left unmarked around 8 PM, while the site remains open and permission is granted.

## Supabase backend

The Supabase project for this build is `attendance-buddy` in the `ap-south-1` (Mumbai) region. The initial schema and access rules have been applied to the live project. The browser uses only a publishable key; never place a `service_role` or secret key in frontend code.

The Free plan is more than enough for this app's tiny attendance records: current published limits include 500 MB database size per project and 50,000 monthly active users. Important trade-off: Supabase may pause a Free project after about 7 days of low activity, and Free projects do not include automatic database backups. This means it is free and suitable for a student-scale launch, but not an uptime guarantee. Restore a paused project from the dashboard if needed, and keep regular JSON backups from the app. Do not rely on it as the only copy of important records.

The database contains:

- `profiles`: profile details and explicit directory opt-in.
- `user_workspaces`: one JSON workspace per authenticated user.
- `student_directory`: a security-invoker view exposing only opted-in name, course, and academic year.

RLS is enabled on both tables. The trigger that creates a profile on account registration is not callable through the public API.

## Run locally

Requires Node.js 20.19+ (or Node.js 22.12+).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite. The `.env.example` contains the public project URL and publishable key for this application. The configured project URL and publishable key are also safe public defaults in the frontend, so the included GitHub Pages workflow can build without repository secrets. Environment variables override those defaults if you fork the app. These values are intended for browser use; access control comes from authentication and RLS.

## Build and test

```bash
npm test
npm run build
npm run preview
```

A GitHub Actions workflow is included under `.github/workflows/ci.yml` to run tests and a production build on pushes and pull requests. Set the two `VITE_SUPABASE_*` repository secrets for CI builds.

## Quick free deployment with GitHub Pages

The workflow `.github/workflows/deploy-pages.yml` builds and publishes the site automatically whenever you push to `main`. Create a GitHub repository named `attendance-buddy`, upload the project contents (the files inside this ZIP, not the ZIP itself), and push them to `main`. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source. Once the workflow succeeds, the site will be at `https://YOUR-GITHUB-USERNAME.github.io/attendance-buddy/`. Then add that exact URL to Supabase Authentication → URL Configuration → Redirect URLs and set it as the Site URL.

The workflow runs the tests before publishing. The configured frontend only contains the Supabase publishable key, never a service-role key.

Static hosting settings:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Node version: 22.12+ recommended

Configure the deployed website URL under Supabase Authentication URL Configuration (Site URL and Redirect URLs). For production, test sign-up, email confirmation if enabled, password sign-in, sign-out, and two separate users before sharing the link.

## Important limitations before a public launch

- The starter timetable is illustrative. Replace it with the real college timetable before relying on projected attendance.
- Browser notifications are not guaranteed while the site is closed. Reliable background push reminders require a push-notification service or native app.
- A browser-only PWA cannot provide a true native Android home-screen widget. That remains a later Android app task.
- Account email confirmation and password-reset email delivery depend on Supabase Auth settings and email-provider configuration.
- This project is an attendance helper, not an official college attendance record.
