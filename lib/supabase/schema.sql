/*
  Cap Horn Conseils — Schéma base de données.

  Migration 100 % idempotente : peut être rejouée sans erreur sur une base
  vierge OU sur une base où la table `leads` existe déjà avec un schéma
  partiel (cas du déploiement initial).

  À exécuter dans le SQL Editor de Supabase.
*/

create extension if not exists "uuid-ossp";

/* 1. Table de base — colonnes minimales d'abord. */
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

/* 2. Colonnes ajoutées séparément : ADD COLUMN IF NOT EXISTS rattrape une
      table créée par un run antérieur sans certaines colonnes. */

-- Tunnel
alter table leads add column if not exists tunnel_type text;
alter table leads add column if not exists sub_type    text;
alter table leads add column if not exists answers     jsonb not null default '{}';

-- Contact
alter table leads add column if not exists first_name   text;
alter table leads add column if not exists last_name    text;
alter table leads add column if not exists email        text;
alter table leads add column if not exists phone        text;
alter table leads add column if not exists company_name text;
alter table leads add column if not exists consent_rgpd boolean not null default false;

-- Scoring (interne — jamais exposé côté user)
alter table leads add column if not exists score           integer not null default 0;
alter table leads add column if not exists score_label     text    not null default 'D';
alter table leads add column if not exists priority        text    not null default 'low';
alter table leads add column if not exists internal_status text    not null default 'cold';
alter table leads add column if not exists tags            text[]  not null default '{}';
alter table leads add column if not exists message_variant text    not null default 'neutral';

-- CRM
alter table leads add column if not exists status      text not null default 'new';
alter table leads add column if not exists notes       text;
alter table leads add column if not exists assigned_to text;

/* 3. Check constraints idempotents. */
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_tunnel_type_check' and conrelid = 'leads'::regclass
  ) then
    alter table leads add constraint leads_tunnel_type_check
      check (tunnel_type in ('pro', 'particulier', 'reseau'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_score_label_check' and conrelid = 'leads'::regclass
  ) then
    alter table leads add constraint leads_score_label_check
      check (score_label in ('A', 'B', 'C', 'D'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_priority_check' and conrelid = 'leads'::regclass
  ) then
    alter table leads add constraint leads_priority_check
      check (priority in ('high', 'medium', 'low'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_internal_status_check' and conrelid = 'leads'::regclass
  ) then
    alter table leads add constraint leads_internal_status_check
      check (internal_status in ('hot', 'warm', 'cold', 'disqualified'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_message_variant_check' and conrelid = 'leads'::regclass
  ) then
    alter table leads add constraint leads_message_variant_check
      check (message_variant in ('positive', 'neutral', 'conditional', 'redirect'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_status_check' and conrelid = 'leads'::regclass
  ) then
    alter table leads add constraint leads_status_check
      check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived'));
  end if;
end $$;

/* 4. NOT NULL sur les colonnes critiques (uniquement si la table est vide
      ou si elles sont déjà remplies — sinon on laisse passer pour ne pas
      casser une base existante avec des lignes incomplètes). */
do $$
begin
  if not exists (select 1 from leads where tunnel_type is null) then
    alter table leads alter column tunnel_type set not null;
  end if;
  if not exists (select 1 from leads where sub_type is null) then
    alter table leads alter column sub_type set not null;
  end if;
  if not exists (select 1 from leads where first_name is null) then
    alter table leads alter column first_name set not null;
  end if;
  if not exists (select 1 from leads where last_name is null) then
    alter table leads alter column last_name set not null;
  end if;
  if not exists (select 1 from leads where email is null) then
    alter table leads alter column email set not null;
  end if;
  if not exists (select 1 from leads where phone is null) then
    alter table leads alter column phone set not null;
  end if;
end $$;

/* 5. Trigger updated_at. */
create or replace function update_leads_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at
  before update on leads
  for each row execute function update_leads_updated_at();

/* 6. Index. */
create index if not exists leads_created_at_idx      on leads (created_at desc);
create index if not exists leads_status_idx          on leads (status);
create index if not exists leads_tunnel_type_idx     on leads (tunnel_type);
create index if not exists leads_score_label_idx     on leads (score_label);
create index if not exists leads_internal_status_idx on leads (internal_status);

/* 7. RLS. */
alter table leads enable row level security;

/*
  ┌──────────────────────────────────────────────────────────────────────┐
  │  ⚠️  DEV / PRE-PROD ONLY                                              │
  │  L'auth admin est hardcodée côté Next.js (lib/admin/auth.ts).        │
  │  Tant qu'on utilise ce mode, les policies ci-dessous autorisent       │
  │  l'anon role (la clé anon est exposée client) à lire / écrire.        │
  │                                                                       │
  │  AVANT MISE EN PRODUCTION :                                           │
  │   1. Remplacer l'auth hardcodée par Supabase Auth ou autre IdP        │
  │   2. Supprimer les policies "anon_*_leads_dev"                        │
  │   3. Recréer des policies "to authenticated using (true)"             │
  │   4. Vérifier que l'anon ne peut plus que insert (capture publique)   │
  └──────────────────────────────────────────────────────────────────────┘
*/

drop policy if exists "anon_insert_leads"     on leads;
drop policy if exists "auth_select_leads"     on leads;
drop policy if exists "auth_update_leads"     on leads;
drop policy if exists "auth_delete_leads"     on leads;
drop policy if exists "anon_select_leads_dev" on leads;
drop policy if exists "anon_update_leads_dev" on leads;
drop policy if exists "anon_delete_leads_dev" on leads;

-- Insertion publique depuis le tunnel (consentement RGPD obligatoire)
create policy "anon_insert_leads" on leads
  for insert to anon
  with check (consent_rgpd = true);

-- DEV-ONLY : lecture / écriture / suppression admin via auth hardcodée
create policy "anon_select_leads_dev" on leads
  for select to anon using (true);

create policy "anon_update_leads_dev" on leads
  for update to anon using (true) with check (true);

create policy "anon_delete_leads_dev" on leads
  for delete to anon using (true);
