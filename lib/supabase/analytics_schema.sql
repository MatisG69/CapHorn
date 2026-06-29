/*
  Cap Horn Conseils — Analytique web (vues de pages).

  Idempotent. À exécuter dans le SQL Editor de Supabase.
  Enregistre chaque vue de page (section, appareil, pays, visiteur) pour
  alimenter la page Analytique de l'admin.
*/

create extension if not exists "uuid-ossp";

create table if not exists page_views (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  path       text not null,
  section    text,
  device     text,
  country    text,
  visitor_id text
);

create index if not exists page_views_created_idx on page_views (created_at desc);
create index if not exists page_views_section_idx  on page_views (section);
create index if not exists page_views_device_idx   on page_views (device);
create index if not exists page_views_country_idx  on page_views (country);

/* RLS — insertion publique (tracking), lecture admin via anon (DEV). */
alter table page_views enable row level security;

drop policy if exists "anon_insert_views"     on page_views;
drop policy if exists "anon_select_views_dev" on page_views;

create policy "anon_insert_views" on page_views for insert to anon with check (true);
create policy "anon_select_views_dev" on page_views for select to anon using (true);
