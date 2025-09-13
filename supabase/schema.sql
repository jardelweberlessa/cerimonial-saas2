-- Cerimonial SaaS - Schema & Policies (modo teste)

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_email text not null,
  event_date date,
  venue text,
  created_at timestamptz not null default now()
);

create table if not exists public.event_members (
  event_id uuid not null references public.events(id) on delete cascade,
  member_email text not null,
  role text not null default 'viewer',
  added_at timestamptz not null default now(),
  primary key (event_id, member_email)
);

alter table public.events enable row level security;
alter table public.event_members enable row level security;

drop policy if exists events_select on public.events;
drop policy if exists events_insert on public.events;
drop policy if exists event_members_select on public.event_members;
drop policy if exists event_members_insert on public.event_members;

create policy events_select on public.events
for select
using (
  owner_email = auth.email()
  or exists (
    select 1 from public.event_members em
    where em.event_id = events.id and em.member_email = auth.email()
  )
);

create policy events_insert on public.events
for insert
with check ( owner_email = auth.email() );

create policy event_members_select on public.event_members
for select
using ( member_email = auth.email() );

create policy event_members_insert on public.event_members
for insert
with check ( member_email = auth.email() );

create or replace function public._ensure_owner_membership()
returns trigger language plpgsql as $$
begin
  insert into public.event_members (event_id, member_email, role)
  values (new.id, new.owner_email, 'owner')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists trg_events_owner_membership on public.events;
create trigger trg_events_owner_membership
after insert on public.events
for each row execute function public._ensure_owner_membership();
