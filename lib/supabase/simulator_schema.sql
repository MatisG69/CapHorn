/*
  Cap Horn Conseils — Simulateur d'économies (assurance emprunteur).

  Deux tables :
    • simulator_estimations : estimations envoyées « à Guillaume » par les
      clients depuis le simulateur public (/simulateur).
    • simulator_settings    : paramètres réglables par Guillaume (taux Cap Horn
      par tranche d'âge, valeurs par défaut du formulaire). Ligne unique.

  Idempotent. À exécuter dans le SQL Editor de Supabase APRÈS schema.sql.
*/

create extension if not exists "uuid-ossp";

/* ─────────────────────────── ESTIMATIONS ─────────────────────────── */

create table if not exists simulator_estimations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table simulator_estimations add column if not exists first_name      text;
alter table simulator_estimations add column if not exists email           text;
alter table simulator_estimations add column if not exists phone           text;
alter table simulator_estimations add column if not exists consent_rgpd    boolean not null default false;
alter table simulator_estimations add column if not exists status          text not null default 'new';
-- Paramètres saisis par le client
alter table simulator_estimations add column if not exists capital         numeric not null default 0;
alter table simulator_estimations add column if not exists duration_years  numeric not null default 0;
alter table simulator_estimations add column if not exists age             numeric not null default 0;
alter table simulator_estimations add column if not exists current_premium numeric not null default 0;
-- Résultat recalculé côté serveur
alter table simulator_estimations add column if not exists caphorn_premium numeric not null default 0;
alter table simulator_estimations add column if not exists monthly_saving  numeric not null default 0;
alter table simulator_estimations add column if not exists yearly_saving   numeric not null default 0;
alter table simulator_estimations add column if not exists total_saving    numeric not null default 0;
alter table simulator_estimations add column if not exists savings_percent numeric not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'simulator_status_check' and conrelid = 'simulator_estimations'::regclass
  ) then
    alter table simulator_estimations add constraint simulator_status_check
      check (status in ('new', 'contacted', 'converted', 'archived'));
  end if;
end $$;

create index if not exists simulator_created_idx on simulator_estimations (created_at desc);
create index if not exists simulator_status_idx  on simulator_estimations (status);

create or replace function update_simulator_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists simulator_updated_at on simulator_estimations;
create trigger simulator_updated_at
  before update on simulator_estimations
  for each row execute function update_simulator_updated_at();

alter table simulator_estimations enable row level security;

drop policy if exists "anon_insert_simulator"     on simulator_estimations;
drop policy if exists "anon_select_simulator_dev" on simulator_estimations;
drop policy if exists "anon_update_simulator_dev" on simulator_estimations;
drop policy if exists "anon_delete_simulator_dev" on simulator_estimations;

create policy "anon_insert_simulator" on simulator_estimations
  for insert to anon with check (consent_rgpd = true);
create policy "anon_select_simulator_dev" on simulator_estimations for select to anon using (true);
create policy "anon_update_simulator_dev" on simulator_estimations for update to anon using (true) with check (true);
create policy "anon_delete_simulator_dev" on simulator_estimations for delete to anon using (true);

/* ─────────────────────────── RÉGLAGES ─────────────────────────── */

create table if not exists simulator_settings (
  id smallint primary key default 1,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint simulator_settings_singleton check (id = 1)
);

-- Ligne unique par défaut (vide → l'app retombe sur DEFAULT_SIMULATOR_SETTINGS)
insert into simulator_settings (id, settings)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table simulator_settings enable row level security;

drop policy if exists "anon_select_sim_settings"     on simulator_settings;
drop policy if exists "anon_upsert_sim_settings_dev" on simulator_settings;
drop policy if exists "anon_update_sim_settings_dev" on simulator_settings;

-- Lecture publique (le simulateur client charge les réglages) ; écriture DEV.
create policy "anon_select_sim_settings"     on simulator_settings for select to anon using (true);
create policy "anon_upsert_sim_settings_dev" on simulator_settings for insert to anon with check (true);
create policy "anon_update_sim_settings_dev" on simulator_settings for update to anon using (true) with check (true);
