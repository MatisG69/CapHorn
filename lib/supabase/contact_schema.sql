/*
  Cap Horn Conseils — Demandes de rendez-vous (formulaire « Prendre contact »).

  Idempotent. À exécuter dans le SQL Editor de Supabase APRÈS schema.sql.
*/

create extension if not exists "uuid-ossp";

create table if not exists appointment_requests (
  id uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table appointment_requests add column if not exists first_name     text;
alter table appointment_requests add column if not exists last_name      text;
alter table appointment_requests add column if not exists email          text;
alter table appointment_requests add column if not exists phone          text;
alter table appointment_requests add column if not exists message        text;
alter table appointment_requests add column if not exists preferred_slot text;
alter table appointment_requests add column if not exists consent_rgpd   boolean not null default false;
alter table appointment_requests add column if not exists status         text not null default 'new';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'appointment_status_check' and conrelid = 'appointment_requests'::regclass
  ) then
    alter table appointment_requests add constraint appointment_status_check
      check (status in ('new', 'contacted', 'scheduled', 'done', 'archived'));
  end if;
end $$;

create index if not exists appointment_created_idx on appointment_requests (created_at desc);
create index if not exists appointment_status_idx  on appointment_requests (status);

create or replace function update_appointment_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists appointment_updated_at on appointment_requests;
create trigger appointment_updated_at
  before update on appointment_requests
  for each row execute function update_appointment_updated_at();

/* RLS — insertion publique (formulaire), lecture/écriture admin via anon (DEV). */
alter table appointment_requests enable row level security;

drop policy if exists "anon_insert_appointments"     on appointment_requests;
drop policy if exists "anon_select_appointments_dev" on appointment_requests;
drop policy if exists "anon_update_appointments_dev" on appointment_requests;
drop policy if exists "anon_delete_appointments_dev" on appointment_requests;

create policy "anon_insert_appointments" on appointment_requests
  for insert to anon with check (consent_rgpd = true);
create policy "anon_select_appointments_dev" on appointment_requests for select to anon using (true);
create policy "anon_update_appointments_dev" on appointment_requests for update to anon using (true) with check (true);
create policy "anon_delete_appointments_dev" on appointment_requests for delete to anon using (true);
