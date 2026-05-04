-- Cap Horn Conseils — Schéma base de données
-- À exécuter dans le SQL Editor de Supabase

create extension if not exists "uuid-ossp";

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Tunnel
  tunnel_type text not null check (tunnel_type in ('pro', 'particulier', 'reseau')),
  sub_type text not null,
  answers jsonb not null default '{}',

  -- Contact
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  company_name text,
  consent_rgpd boolean not null default false,

  -- Scoring (interne — jamais exposé côté user)
  score integer not null default 0,
  score_label text not null check (score_label in ('A', 'B', 'C', 'D')),
  priority text not null check (priority in ('high', 'medium', 'low')),
  internal_status text not null check (internal_status in ('hot', 'warm', 'cold', 'disqualified')),
  tags text[] not null default '{}',
  message_variant text not null check (message_variant in ('positive', 'neutral', 'conditional', 'redirect')),

  -- CRM
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived')),
  notes text,
  assigned_to text
);

-- Trigger updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row
  execute function update_updated_at();

-- Index
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_tunnel_type_idx on leads (tunnel_type);
create index if not exists leads_score_label_idx on leads (score_label);
create index if not exists leads_internal_status_idx on leads (internal_status);

-- RLS
alter table leads enable row level security;

-- Anonyme : peut insérer uniquement si consent_rgpd = true
create policy "anon_insert_leads" on leads
  for insert to anon
  with check (consent_rgpd = true);

-- Authentifié : lecture complète
create policy "auth_select_leads" on leads
  for select to authenticated
  using (true);

-- Authentifié : mise à jour (statut, notes)
create policy "auth_update_leads" on leads
  for update to authenticated
  using (true);

-- Authentifié : suppression
create policy "auth_delete_leads" on leads
  for delete to authenticated
  using (true);
