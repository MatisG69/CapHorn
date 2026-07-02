-- ─────────────────────────────────────────────────────────────────────────
-- Stockage des pièces jointes du tunnel (bilans, devis, justificatifs).
--
-- Bucket PRIVÉ : les documents financiers ne doivent jamais être publics.
-- • Le tunnel (visiteur anonyme) peut UPLOADER via la clé anon.
-- • La lecture se fait uniquement côté admin via des URL signées à durée
--   limitée (createSignedUrl), générées par l'application.
--
-- À exécuter une fois dans l'éditeur SQL Supabase.
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Bucket privé
insert into storage.buckets (id, name, public)
values ('lead-documents', 'lead-documents', false)
on conflict (id) do nothing;

-- 2. Autoriser l'upload anonyme (le visiteur du tunnel n'est pas authentifié)
drop policy if exists "tunnel upload lead documents" on storage.objects;
create policy "tunnel upload lead documents"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'lead-documents');

-- 3. Lecture réservée au rôle service (URL signées générées par le back).
--    On n'ouvre PAS de policy SELECT publique : les fichiers restent privés.
--    Les URL signées passent par le service_role et contournent la RLS.
--    Si l'admin lit via la clé anon, ajouter une policy SELECT restreinte
--    à des utilisateurs authentifiés :
-- drop policy if exists "admin read lead documents" on storage.objects;
-- create policy "admin read lead documents"
--   on storage.objects for select
--   to authenticated
--   using (bucket_id = 'lead-documents');
