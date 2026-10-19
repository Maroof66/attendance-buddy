-- Attendance Buddy schema. All user-owned data is protected by Row Level Security.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  course text not null default 'MBBS',
  academic_year text not null default '2nd Year',
  directory_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (char_length(display_name) <= 100),
  constraint profiles_course_length check (char_length(course) <= 100)
);

create table if not exists public.user_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_workspaces enable row level security;

drop policy if exists "Profiles are readable by owner or opted-in directory members" on public.profiles;
create policy "Profiles are readable by owner or opted-in directory members" on public.profiles
  for select to authenticated using ((select auth.uid()) = id or directory_visible = true);
drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Workspace is readable by owner" on public.user_workspaces;
create policy "Workspace is readable by owner" on public.user_workspaces
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Workspace is insertable by owner" on public.user_workspaces;
create policy "Workspace is insertable by owner" on public.user_workspaces
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Workspace is updatable by owner" on public.user_workspaces;
create policy "Workspace is updatable by owner" on public.user_workspaces
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.profiles from anon, authenticated;
revoke all on public.user_workspaces from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.user_workspaces to authenticated;

-- Only opted-in name/course/year is returned; email and attendance are not exposed.
create or replace view public.student_directory with (security_invoker = true) as
select id, display_name, course, academic_year
from public.profiles
where directory_visible = true and display_name <> '';
revoke all on public.student_directory from anon, authenticated;
grant select on public.student_directory to authenticated;

-- New users get a private profile by default. This function is trigger-only.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, course, academic_year, directory_visible)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(new.raw_user_meta_data ->> 'course', 'MBBS'),
    coalesce(new.raw_user_meta_data ->> 'academic_year', '2nd Year'),
    false
  ) on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
