-- Run this in Supabase: Project > SQL Editor > New Query
-- =========================================================

-- 1. PROFILES — one row per logged-in user, holds their role.
-- Supabase Auth already stores email/password in auth.users;
-- we extend it with a role here (admin / teacher / student).
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text not null default 'student' check (role in ('admin','teacher','student')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Anyone logged in can see their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Admins can view every profile
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Only admins can change roles
create policy "Admins can update profiles"
  on profiles for update
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Auto-create a profile row whenever a new user signs up (defaults to 'student')
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. NEWS / NOTICES
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid references profiles(id),
  created_at timestamptz default now()
);

alter table news enable row level security;

create policy "Anyone can read news"
  on news for select using (true);

create policy "Admins and teachers can write news"
  on news for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
  );

create policy "Admins and teachers can update news"
  on news for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
  );

create policy "Admins and teachers can delete news"
  on news for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
  );


-- 3. GALLERY
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  created_at timestamptz default now()
);

alter table gallery enable row level security;

create policy "Anyone can read gallery"
  on gallery for select using (true);

create policy "Admins and teachers manage gallery"
  on gallery for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
  );


-- 4. STAFF DIRECTORY
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text,
  subject text,
  photo_url text,
  bio text,
  created_at timestamptz default now()
);

alter table staff enable row level security;

create policy "Anyone can read staff"
  on staff for select using (true);

create policy "Only admins manage staff"
  on staff for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );


-- 5. ADMISSIONS INFO (simple editable content block)
create table if not exists admissions_info (
  id int primary key default 1,
  content text not null default '',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into admissions_info (id, content) values (1, 'Admissions information coming soon.')
  on conflict (id) do nothing;

alter table admissions_info enable row level security;

create policy "Anyone can read admissions info"
  on admissions_info for select using (true);

create policy "Only admins edit admissions info"
  on admissions_info for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );


-- 6. CONTACT MESSAGES (public can submit, only admin can read)
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

create policy "Anyone can submit a contact message"
  on contact_messages for insert with check (true);

create policy "Only admins read contact messages"
  on contact_messages for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- =========================================================
-- IMPORTANT: after running this, make your own account an admin:
-- update profiles set role = 'admin' where id = 'YOUR-USER-UUID';
-- (find your UUID in Supabase: Authentication > Users)
-- =========================================================
