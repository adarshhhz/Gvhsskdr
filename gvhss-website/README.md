# GVHSS KADIRUR — Full Website (Next.js + Supabase)

A school website with public pages (Home, About, Staff, News, Gallery,
Admissions, Contact) plus an admin system with three roles: **admin**,
**teacher**, **student**.

## What you get
- Public site with dynamic content (news, gallery, staff, admissions text
  all editable without touching code)
- Login system (Supabase Auth)
- Admin panel to manage everything
- Role-based access enforced at the database level (Row Level Security) —
  even if someone bypasses the UI, the database itself blocks unauthorized
  reads/writes
- Security headers, generic login errors, service-role key never exposed
  to the browser

## One-time setup

### 1. Create a Supabase project
Go to https://supabase.com → New Project (free tier is fine).

### 2. Run the database schema
In your Supabase project: **SQL Editor → New Query** → paste the entire
contents of `supabase/schema.sql` → Run.

### 3. Get your API keys
In Supabase: **Settings → API**. You'll need:
- Project URL
- `anon` public key
- `service_role` key (⚠️ secret — never put this in frontend code)

### 4. Set environment variables
Copy `.env.local.example` to `.env.local` and fill in the three values
from step 3. This file is only for local testing — **do not commit it**.

### 5. Install and run locally
```bash
npm install
npm run dev
```
Visit http://localhost:3000

### 6. Make yourself an admin
1. Go to your site → sign up isn't public by design (only admins create
   accounts). Instead, create your first account directly in Supabase:
   **Authentication → Users → Add User** (set email + password).
2. In **SQL Editor**, run:
   ```sql
   update profiles set role = 'admin' where id = 'paste-the-user-uuid-here';
   ```
   (Find the UUID next to the user in Authentication → Users.)
3. Log in on your site with that email/password → you'll see an "Admin"
   link in the nav.

### 7. Deploy to Vercel
1. Push this project to a GitHub repo.
2. In Vercel: **New Project → Import** your repo.
3. Add the same three environment variables in Vercel's project settings
   (**Settings → Environment Variables**).
4. Deploy. Vercel auto-builds on every push to your main branch.

## How day-to-day admin works
- **Admin** can: manage staff directory, admissions text, create/delete
  user accounts, assign roles, view contact messages, plus everything
  teachers can do.
- **Teacher** can: post/edit news & notices, add/remove gallery photos.
- **Student**: can log in, but has no admin panel access — this role is
  a foundation for features you add later (results, timetable, etc.),
  gated the same way as the admin pages.
- New accounts are created by an admin from **Admin → Users & Roles**,
  not by public self-signup — appropriate for a school where you want
  to control who gets an account.

## Security notes
- Never commit `.env.local` — it's already in `.gitignore`.
- The `service_role` key is only read inside `/pages/api/*` (server-side).
  It is never sent to the browser.
- All content tables use Row Level Security — public visitors can only
  read, never write, except the contact form (insert-only) and login
  (handled by Supabase Auth with built-in rate limiting).
- Passwords are hashed and managed entirely by Supabase Auth — this app
  never sees or stores raw passwords beyond the initial signup call.
- Consider enabling MFA for admin accounts in Supabase Auth settings
  once the site is live.

## Extending later
- Real image uploads: enable a Supabase **Storage** bucket and swap the
  gallery form's URL field for a file picker.
- Results/timetables for students: add a new table with RLS policies
  scoped to `role = 'student'`, following the same pattern as `news`.
