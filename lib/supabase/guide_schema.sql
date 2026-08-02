/*
  Cap Horn Conseils — Téléchargements de guides (aimants à prospects).

  Un guide par page métier : `guide_slug` distingue les contenus, `source_page`
  la page d'où vient le contact. Idempotent. À exécuter dans le SQL Editor de
  Supabase APRÈS schema.sql.
*/

create extension if not exists "uuid-ossp";

create table if not exists guide_requests (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now()
);

alter table guide_requests add column if not exists first_name   text;
alter table guide_requests add column if not exists last_name    text;
alter table guide_requests add column if not exists email        text;
alter table guide_requests add column if not exists phone        text;
alter table guide_requests add column if not exists situation    text;
alter table guide_requests add column if not exists guide_slug   text not null default 'installation-medicale';
alter table guide_requests add column if not exists source_page  text;
alter table guide_requests add column if not exists consent_rgpd boolean not null default false;
alter table guide_requests add column if not exists status       text not null default 'new';

/* Recréée à chaque exécution : la liste des statuts évolue avec l'admin, un
   `if not exists` figerait l'ancienne contrainte sur une base déjà migrée. */
alter table guide_requests drop constraint if exists guide_status_check;
alter table guide_requests add constraint guide_status_check
  check (status in ('new', 'sent', 'contacted', 'converted', 'archived'));

create index if not exists guide_created_idx on guide_requests (created_at desc);
create index if not exists guide_slug_idx    on guide_requests (guide_slug);
create index if not exists guide_email_idx   on guide_requests (email);

/* RLS — insertion publique (formulaire), lecture/écriture admin via anon (DEV). */
alter table guide_requests enable row level security;

drop policy if exists "anon_insert_guide_requests"     on guide_requests;
drop policy if exists "anon_select_guide_requests_dev" on guide_requests;
drop policy if exists "anon_update_guide_requests_dev" on guide_requests;
drop policy if exists "anon_delete_guide_requests_dev" on guide_requests;

create policy "anon_insert_guide_requests" on guide_requests
  for insert to anon with check (consent_rgpd = true);
create policy "anon_select_guide_requests_dev" on guide_requests for select to anon using (true);
create policy "anon_update_guide_requests_dev" on guide_requests for update to anon using (true) with check (true);
create policy "anon_delete_guide_requests_dev" on guide_requests for delete to anon using (true);
