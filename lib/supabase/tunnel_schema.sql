/*
  Cap Horn Conseils — Tunnel éditable (questions/réponses gérées en admin).

  Idempotent. À exécuter dans le SQL Editor de Supabase APRÈS schema.sql.

  Modèle déclaratif :
   - tunnel_steps   : une étape (question/écran) + routage par défaut.
   - tunnel_options : les réponses possibles d'une étape de type « choice »
                      (ou les règles de routage pour l'étape « contact »,
                      branchée sur la réponse d'un champ antérieur).

  Tant que ces tables sont vides, le tunnel utilise la config par défaut codée
  dans l'application (fallback) → aucun risque pour le tunnel live.
*/

create extension if not exists "uuid-ossp";

/* 1. Étapes ------------------------------------------------------------- */
create table if not exists tunnel_steps (
  id           text primary key,                 -- slug (ex: 'pro_need')
  type         text not null default 'choice',   -- choice|input|contact|finalize|result
  title        text not null default '',
  subtitle     text,
  progress     integer not null default 0,
  position     integer not null default 0,
  is_first     boolean not null default false,
  input_type   text,                             -- text|number|email|tel
  input_label  text,
  input_placeholder text,
  input_suffix text,
  default_next_step_id text,                      -- étape suivante par défaut
  branch_on    text,                              -- routage selon un champ antérieur (ex: 'entry')
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tunnel_steps_position_idx on tunnel_steps (position);

/* 2. Options / réponses ------------------------------------------------- */
create table if not exists tunnel_options (
  id           uuid primary key default uuid_generate_v4(),
  step_id      text not null references tunnel_steps (id) on delete cascade,
  value        text not null,
  label        text not null default '',
  description  text,
  next_step_id text,                              -- routage spécifique à cette réponse
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists tunnel_options_step_idx on tunnel_options (step_id, position);

/* 3. updated_at ---------------------------------------------------------- */
create or replace function update_tunnel_steps_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists tunnel_steps_updated_at on tunnel_steps;
create trigger tunnel_steps_updated_at
  before update on tunnel_steps
  for each row execute function update_tunnel_steps_updated_at();

/* 4. RLS ----------------------------------------------------------------
   Lecture PUBLIQUE (le tunnel public doit lire la config des questions).
   Écriture admin via l'anon role (auth hardcodée — DEV/PRE-PROD). */
alter table tunnel_steps   enable row level security;
alter table tunnel_options enable row level security;

drop policy if exists "public_read_steps"   on tunnel_steps;
drop policy if exists "anon_write_steps_dev" on tunnel_steps;
drop policy if exists "public_read_options"   on tunnel_options;
drop policy if exists "anon_write_options_dev" on tunnel_options;

create policy "public_read_steps"   on tunnel_steps   for select to anon using (true);
create policy "anon_write_steps_dev" on tunnel_steps  for all   to anon using (true) with check (true);
create policy "public_read_options"   on tunnel_options for select to anon using (true);
create policy "anon_write_options_dev" on tunnel_options for all to anon using (true) with check (true);
