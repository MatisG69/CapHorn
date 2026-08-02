/*
  Cap Horn Conseils — Parrainage / apport d'affaires.
  Alimente le formulaire de /parrainage-apporteur-affaires et l'écran
  « Parrainages » du portail admin.

  Une ligne = un couple parrain / filleul. Le parrain et le filleul vivent dans
  des colonnes distinctes (et non dans un champ message) : c'est ce qui permet
  de suivre le taux de transformation des recommandations et de savoir à qui
  une prime est due.

  Idempotent. À exécuter dans le SQL Editor de Supabase APRÈS schema.sql.
*/

create extension if not exists "uuid-ossp";

create table if not exists referrals (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

/* Le parrain : celui qui recommande, et à qui la prime sera versée. */
alter table referrals add column if not exists parrain_first_name text;
alter table referrals add column if not exists parrain_last_name  text;
alter table referrals add column if not exists parrain_email      text;
alter table referrals add column if not exists parrain_phone      text;
/* Lien déclaré avec le filleul (proche, client, confrère, partenaire…). */
alter table referrals add column if not exists parrain_relation   text;

/* Le filleul : la personne recommandée, que Guillaume rappelle sous 24 h. */
alter table referrals add column if not exists filleul_first_name text;
alter table referrals add column if not exists filleul_last_name  text;
alter table referrals add column if not exists filleul_email      text;
alter table referrals add column if not exists filleul_phone      text;

/* Le projet recommandé. */
alter table referrals add column if not exists project_type    text;
alter table referrals add column if not exists project_details text;

/* Consentements. `consent_filleul` = le parrain certifie avoir obtenu l'accord
   préalable du filleul avant de transmettre ses coordonnées. Transmettre les
   données d'un tiers sans cette trace n'est pas défendable en cas de contrôle. */
alter table referrals add column if not exists consent_rgpd    boolean not null default false;
alter table referrals add column if not exists consent_filleul boolean not null default false;

/* Provenance : page d'origine, pour distinguer les sources de parrainage. */
alter table referrals add column if not exists source_page text;

/* Suivi commercial et prime. */
alter table referrals add column if not exists status        text not null default 'new';
alter table referrals add column if not exists reward_amount numeric(10,2);
alter table referrals add column if not exists notes         text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'referral_status_check' and conrelid = 'referrals'::regclass
  ) then
    alter table referrals add constraint referral_status_check
      check (status in ('new', 'contacted', 'study', 'signed', 'paid', 'lost', 'archived'));
  end if;
end $$;

create index if not exists referral_created_idx on referrals (created_at desc);
create index if not exists referral_status_idx  on referrals (status);
/* Le suivi des primes se fait parrain par parrain : un parrain récurrent doit
   se retrouver d'un coup d'œil. */
create index if not exists referral_parrain_email_idx on referrals (parrain_email);

create or replace function update_referral_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists referral_updated_at on referrals;
create trigger referral_updated_at
  before update on referrals
  for each row execute function update_referral_updated_at();

/* RLS — insertion publique (formulaire), lecture/écriture admin via anon (DEV),
   alignée sur appointment_requests. L'insertion exige les DEUX consentements :
   la politique elle-même refuse un parrainage sans accord du filleul. */
alter table referrals enable row level security;

drop policy if exists "anon_insert_referrals"     on referrals;
drop policy if exists "anon_select_referrals_dev" on referrals;
drop policy if exists "anon_update_referrals_dev" on referrals;
drop policy if exists "anon_delete_referrals_dev" on referrals;

create policy "anon_insert_referrals" on referrals
  for insert to anon with check (consent_rgpd = true and consent_filleul = true);
create policy "anon_select_referrals_dev" on referrals for select to anon using (true);
create policy "anon_update_referrals_dev" on referrals for update to anon using (true) with check (true);
create policy "anon_delete_referrals_dev" on referrals for delete to anon using (true);
