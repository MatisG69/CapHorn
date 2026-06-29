/*
  Cap Horn Conseils — Blog (articles gérés depuis l'espace admin).

  Idempotent : peut être rejoué sans erreur.
  À exécuter dans le SQL Editor de Supabase APRÈS schema.sql.
*/

create extension if not exists "uuid-ossp";

/* 1. Table des articles ------------------------------------------------- */
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table blog_posts add column if not exists title           text;
alter table blog_posts add column if not exists slug            text;
alter table blog_posts add column if not exists excerpt         text;
alter table blog_posts add column if not exists body            text not null default '';
alter table blog_posts add column if not exists cover_image_url text;
alter table blog_posts add column if not exists category        text;
alter table blog_posts add column if not exists author          text not null default 'Guillaume Horn';
alter table blog_posts add column if not exists published       boolean not null default true;
alter table blog_posts add column if not exists published_at    timestamptz not null default now();

-- Slug unique (clé d'URL /blog/<slug>)
create unique index if not exists blog_posts_slug_uidx on blog_posts (slug);
create index if not exists blog_posts_published_idx     on blog_posts (published, published_at desc);
create index if not exists blog_posts_category_idx      on blog_posts (category);

/* 2. updated_at automatique --------------------------------------------- */
create or replace function update_blog_posts_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_updated_at on blog_posts;
create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_blog_posts_updated_at();

/* 3. RLS ----------------------------------------------------------------
   Lecture publique des articles publiés ; écriture admin via l'anon role
   (auth admin hardcodée côté Next.js — même logique que la table leads,
   DEV / PRE-PROD uniquement, à durcir avant prod). */
alter table blog_posts enable row level security;

drop policy if exists "public_select_published_posts" on blog_posts;
drop policy if exists "anon_select_posts_dev"          on blog_posts;
drop policy if exists "anon_insert_posts_dev"          on blog_posts;
drop policy if exists "anon_update_posts_dev"          on blog_posts;
drop policy if exists "anon_delete_posts_dev"          on blog_posts;

-- Lecture publique : uniquement les articles publiés
create policy "public_select_published_posts" on blog_posts
  for select to anon using (published = true);

-- DEV-ONLY : l'admin (anon) peut tout lire / écrire / supprimer
create policy "anon_select_posts_dev" on blog_posts for select to anon using (true);
create policy "anon_insert_posts_dev" on blog_posts for insert to anon with check (true);
create policy "anon_update_posts_dev" on blog_posts for update to anon using (true) with check (true);
create policy "anon_delete_posts_dev" on blog_posts for delete to anon using (true);

/* 4. Storage — bucket public pour les photos des articles --------------- */
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "blog_images_public_read"   on storage.objects;
drop policy if exists "blog_images_anon_insert"   on storage.objects;
drop policy if exists "blog_images_anon_delete"   on storage.objects;

create policy "blog_images_public_read" on storage.objects
  for select to anon using (bucket_id = 'blog-images');

create policy "blog_images_anon_insert" on storage.objects
  for insert to anon with check (bucket_id = 'blog-images');

create policy "blog_images_anon_delete" on storage.objects
  for delete to anon using (bucket_id = 'blog-images');
