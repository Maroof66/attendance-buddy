# Attendance Buddy launch checklist

## Backend status
- [x] Supabase project created in `ap-south-1`.
- [x] Schema created for profiles and per-user workspaces.
- [x] Row Level Security enabled for both tables.
- [x] Directory view restricted to opted-in name/course/year fields.
- [x] Public execute access revoked from the profile-creation trigger function.
- [ ] Test sign-up and email confirmation from the deployed origin.
- [ ] Verify two accounts cannot read each other's `user_workspaces` rows.
- [ ] Verify opted-out profiles are absent from `student_directory`.

## Before inviting classmates
- [ ] Confirm the real timetable, class timings, and thresholds with the college.
- [ ] Configure Supabase Auth Site URL and Redirect URLs for the production domain.
- [ ] Configure email delivery/password reset if email confirmation is enabled.
- [ ] Deploy static frontend with `npm run build` and output directory `dist`.
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting dashboard.
- [ ] Test sign-up, sign-in, sign-out, save/refresh/sync, holiday exclusion, timetable editing, and JSON backup/restore.
- [ ] Test PWA installation and offline shell on Android Chrome and iOS Safari.
- [ ] Explain that directory visibility is opt-in and attendance remains private.

## Deploy settings
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22.12+ recommended
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
