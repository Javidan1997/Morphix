-- Configuro inquiries: fix RLS recursion, add Data API grants and a list index.
--
-- The pergola configurator's project-brief form inserts as the `anon` role from
-- the public site; the admin dashboard reads and updates the same table as a
-- signed-in admin. No new columns are required: the proposed meeting times,
-- the timezone and the saved design all travel in the existing `metadata`
-- jsonb column.

-- 1. Fix infinite recursion in the admin-list policy.
--    The original policy on configuro_admins selected FROM configuro_admins in
--    its own USING clause. Evaluating it re-enters the same policy, so Postgres
--    aborts with 42P17 "infinite recursion detected in policy for relation".
--    Because the inquiry policies below also probe configuro_admins, that
--    recursion takes the whole admin read path down with it.
--
--    A row in this table *is* the admin grant, so a member only ever needs to
--    see their own row. That predicate is self-contained and cannot recurse,
--    and the exists() probes below still resolve correctly: an admin finds
--    their row, everyone else finds nothing.
drop policy if exists "Configuro admins can read admin list" on public.configuro_admins;
create policy "Configuro admins can read their own admin row"
on public.configuro_admins
for select
to authenticated
using ( user_id = (select auth.uid()) );

-- 2. Data API grants.
--    Enabling RLS and writing policies is not sufficient on its own. A table
--    created through SQL is not necessarily exposed to the Data (REST) API, and
--    without table privileges PostgREST rejects the request with
--    "permission denied for table configuro_inquiries" (SQLSTATE 42501) before
--    any policy is evaluated. Grants decide whether the table is reachable at
--    all; the policies still decide which rows each role may touch.
--
--    Least privilege: anon may only insert, so the public form can submit a
--    brief but can never read the lead list back.
grant usage on schema public to anon, authenticated;

grant insert on table public.configuro_inquiries to anon;
grant select, insert, update on table public.configuro_inquiries to authenticated;
grant select on table public.configuro_admins to authenticated;

-- 3. RLS policy performance.
--    The original admin policies called auth.uid() inline, which re-evaluates
--    it once per scanned row. Wrapping it in a scalar subquery lets Postgres
--    evaluate it a single time per statement.
drop policy if exists "Configuro admins can read inquiries" on public.configuro_inquiries;
create policy "Configuro admins can read inquiries"
on public.configuro_inquiries
for select
to authenticated
using (
  exists (
    select 1
    from public.configuro_admins admins
    where admins.user_id = (select auth.uid())
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
    where admins.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.configuro_admins admins
    where admins.user_id = (select auth.uid())
  )
);

-- 4. Index for the admin list query.
--    The dashboard reads `?select=*&order=created_at.desc`, which sorts the
--    whole table on every load without this.
create index if not exists configuro_inquiries_created_at_idx
  on public.configuro_inquiries (created_at desc);

-- 5. Pin the trigger function's search_path.
--    A function with a mutable search_path is flagged by the Supabase linter
--    (function_search_path_mutable). now() lives in pg_catalog, which stays on
--    the implicit path, so the body still resolves with an empty search_path.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 6. Bound what an anonymous visitor may insert.
--    The original policy was `with check (true)`, which the Supabase linter
--    flags (0024_permissive_rls_policy): anyone holding the publishable key
--    could file a row that already claims to be triaged, or push arbitrarily
--    large text into the table.
--
--    A public form must stay open to inserts, so the fix is to constrain the
--    row rather than the caller: pin the incoming status to 'new' so only an
--    admin can advance it, and cap the free-text columns. Limits are set well
--    above what any current form submits, and `metadata` is deliberately left
--    unbounded because the templates studio stores a preview image there.
drop policy if exists "Public visitors can submit Configuro inquiries" on public.configuro_inquiries;
create policy "Public visitors can submit Configuro inquiries"
on public.configuro_inquiries
for insert
to anon, authenticated
with check (
  status = 'new'
  and length(coalesce(full_name, '')) <= 200
  and length(coalesce(email, '')) <= 320
  and length(coalesce(company, '')) <= 200
  and length(coalesce(website, '')) <= 500
  and length(coalesce(product_name, '')) <= 200
  and length(coalesce(budget, '')) <= 100
  and length(coalesce(timeline, '')) <= 100
  and length(coalesce(source, '')) <= 60
  and length(coalesce(brief, '')) <= 20000
);
