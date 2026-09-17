-- =========================================================
-- v2 ADDITIONS: testimonials, downloads/circulars, page content
-- Run this section too if you already ran the schema above.
-- =========================================================

-- 7. TESTIMONIALS
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  message text not null,
  created_at timestamptz default now()
);
alter table testimonials enable row level security;

create policy "Anyone can read testimonials"
  on testimonials for select using (true);
create policy "Admins and teachers manage testimonials"
  on testimonials for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
  );

-- 8. DOWNLOADS / CIRCULARS
create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  created_at timestamptz default now()
);
alter table downloads enable row level security;

create policy "Anyone can read downloads"
  on downloads for select using (true);
create policy "Admins and teachers manage downloads"
  on downloads for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
  );

-- 9. PAGE CONTENT BLOCKS (principal's message, etc.)
create table if not exists page_content (
  key text primary key,
  content text not null default '',
  updated_at timestamptz default now()
);
insert into page_content (key, content) values
  ('principal_message', 'Welcome to GVHSS KADIRUR. We are committed to nurturing every student to reach their full potential.'),
  ('principal_name', 'Principal Name')
on conflict (key) do nothing;

alter table page_content enable row level security;

create policy "Anyone can read page content"
  on page_content for select using (true);
create policy "Only admins edit page content"
  on page_content for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Add optional phone column to contact_messages (safe if already applied)
alter table contact_messages add column if not exists phone text;
