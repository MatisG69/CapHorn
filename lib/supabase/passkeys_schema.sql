/*
  Cap Horn Conseils — Empreintes / passkeys admin (WebAuthn).

  Chaque ligne = une empreinte (authentificateur de plateforme, ex. Touch ID)
  enregistrée pour se connecter à l'espace admin. Une empreinte n'autorise la
  connexion qu'une fois `status = 'approved'` (validée depuis la page Paramètres).

  Idempotent. À exécuter dans le SQL Editor de Supabase.
*/

create extension if not exists "uuid-ossp";

create table if not exists admin_passkeys (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  email         text not null,
  label         text,
  credential_id text not null,
  public_key    text not null,
  counter       bigint not null default 0,
  transports    text,
  status        text not null default 'pending'  -- 'pending' | 'approved'
);

create unique index if not exists admin_passkeys_credential_uidx on admin_passkeys (credential_id);
create index if not exists admin_passkeys_status_idx on admin_passkeys (status);

/* RLS : table sensible. Aucune policy anon ; l'accès se fait exclusivement
   côté serveur via la clé service_role (routes API / actions admin). */
alter table admin_passkeys enable row level security;
