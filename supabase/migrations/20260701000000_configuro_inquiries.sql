create table if not exists public.configuro_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'scheduled', 'archived')),
  source text not null default 'website',
  full_name text not null default '',
  email text not null default '',
  company text not null default '',
  website text not null default '',
  product_name text not null default '',
  budget text not null default '',
  timeline text not null default '',
  brief text not null default '',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.configuro_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_configuro_inquiries_updated_at on public.configuro_inquiries;
create trigger set_configuro_inquiries_updated_at
before update on public.configuro_inquiries
for each row
execute function public.set_updated_at();

alter table public.configuro_inquiries enable row level security;
alter table public.configuro_admins enable row level security;

drop policy if exists "Public visitors can submit Configuro inquiries" on public.configuro_inquiries;
create policy "Public visitors can submit Configuro inquiries"
on public.configuro_inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "Configuro admins can read inquiries" on public.configuro_inquiries;
create policy "Configuro admins can read inquiries"
on public.configuro_inquiries
for select
to authenticated
using (
  exists (
    select 1
    from public.configuro_admins admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Configuro admins can update inquiries" on public.configuro_inquiries;
create policy "Configuro admins can update inquiries"
on public.configuro_inquiries
for update
to authenticated
using (
  exists (
    select 1
    from public.configuro_admins admins
    where admins.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.configuro_admins admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Configuro admins can read admin list" on public.configuro_admins;
create policy "Configuro admins can read admin list"
on public.configuro_admins
for select
to authenticated
using (
  exists (
    select 1
    from public.configuro_admins admins
    where admins.user_id = auth.uid()
  )
);

-- After creating your Supabase Auth admin user, run this with that user's UUID:
-- insert into public.configuro_admins (user_id) values ('00000000-0000-0000-0000-000000000000');
