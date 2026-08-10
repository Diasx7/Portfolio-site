-- =============================================================
-- Schema do portfólio — rodar no SQL Editor do painel do Supabase
-- Projeto Supabase compartilhado: tudo do portfólio usa o prefixo
-- "portfolio_" e este script só mexe nessas quatro tabelas.
-- Pode ser rodado mais de uma vez sem quebrar.
-- =============================================================

-- ---------- Tabelas ----------

create table if not exists portfolio_projetos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text not null default '',
  tags text[] not null default '{}',
  link_demo text,
  link_codigo text,
  status text not null default 'concluido' check (status in ('concluido', 'em_andamento')),
  destaque boolean not null default false,
  visivel boolean not null default true,
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  -- Array jsonb de objetos {"url": "...", "legenda": "..."}
  imagens jsonb not null default '[]'::jsonb
);

-- Migração segura da coluna "imagens":
-- - banco novo: create table acima já cria em jsonb, nada a fazer aqui;
-- - banco que só tem o portfolio_projetos antigo (sem a coluna): cria em jsonb;
-- - banco que já rodou uma versão anterior deste script (coluna text[] com
--   só as URLs): converte pra jsonb, preservando a URL e legenda vazia;
-- - banco que já está em jsonb (rodando o script de novo): não faz nada.
do $$
declare
  tipo_atual text;
begin
  select data_type into tipo_atual
  from information_schema.columns
  where table_name = 'portfolio_projetos' and column_name = 'imagens';

  if tipo_atual is null then
    alter table portfolio_projetos add column imagens jsonb not null default '[]'::jsonb;
  elsif tipo_atual = 'ARRAY' then
    alter table portfolio_projetos alter column imagens drop default;
    alter table portfolio_projetos alter column imagens type jsonb using (
      coalesce(
        (select jsonb_agg(jsonb_build_object('url', u, 'legenda', ''))
         from unnest(imagens) as u),
        '[]'::jsonb
      )
    );
    alter table portfolio_projetos alter column imagens set default '[]'::jsonb;
    alter table portfolio_projetos alter column imagens set not null;
  end if;
end $$;

create table if not exists portfolio_tecnologias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  grupo text not null default 'domino' check (grupo in ('domino', 'tambem_uso')),
  ordem integer not null default 0
);

create table if not exists portfolio_certificados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  plataforma text not null default '',
  ano integer,
  link text
);

-- Textos editáveis do site (chave/valor)
create table if not exists portfolio_textos_site (
  chave text primary key,
  valor text not null default ''
);

-- ---------- RLS: leitura pública, escrita só pelo dono ----------
-- O projeto Supabase tem outros usuários; a escrita fica restrita
-- ao usuário autenticado com o e-mail do dono do portfólio.

alter table portfolio_projetos enable row level security;
alter table portfolio_tecnologias enable row level security;
alter table portfolio_certificados enable row level security;
alter table portfolio_textos_site enable row level security;

-- Leitura liberada pra todo mundo (site público)
drop policy if exists "leitura publica" on portfolio_projetos;
create policy "leitura publica" on portfolio_projetos for select using (true);

drop policy if exists "leitura publica" on portfolio_tecnologias;
create policy "leitura publica" on portfolio_tecnologias for select using (true);

drop policy if exists "leitura publica" on portfolio_certificados;
create policy "leitura publica" on portfolio_certificados for select using (true);

drop policy if exists "leitura publica" on portfolio_textos_site;
create policy "leitura publica" on portfolio_textos_site for select using (true);

-- Escrita só pro dono (confere o e-mail do JWT)

-- portfolio_projetos
drop policy if exists "escrita autenticada" on portfolio_projetos;
drop policy if exists "escrita dono insert" on portfolio_projetos;
create policy "escrita dono insert" on portfolio_projetos for insert
  to authenticated with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono update" on portfolio_projetos;
create policy "escrita dono update" on portfolio_projetos for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono delete" on portfolio_projetos;
create policy "escrita dono delete" on portfolio_projetos for delete
  to authenticated using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');

-- portfolio_tecnologias
drop policy if exists "escrita autenticada" on portfolio_tecnologias;
drop policy if exists "escrita dono insert" on portfolio_tecnologias;
create policy "escrita dono insert" on portfolio_tecnologias for insert
  to authenticated with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono update" on portfolio_tecnologias;
create policy "escrita dono update" on portfolio_tecnologias for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono delete" on portfolio_tecnologias;
create policy "escrita dono delete" on portfolio_tecnologias for delete
  to authenticated using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');

-- portfolio_certificados
drop policy if exists "escrita autenticada" on portfolio_certificados;
drop policy if exists "escrita dono insert" on portfolio_certificados;
create policy "escrita dono insert" on portfolio_certificados for insert
  to authenticated with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono update" on portfolio_certificados;
create policy "escrita dono update" on portfolio_certificados for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono delete" on portfolio_certificados;
create policy "escrita dono delete" on portfolio_certificados for delete
  to authenticated using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');

-- portfolio_textos_site
drop policy if exists "escrita autenticada" on portfolio_textos_site;
drop policy if exists "escrita dono insert" on portfolio_textos_site;
create policy "escrita dono insert" on portfolio_textos_site for insert
  to authenticated with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono update" on portfolio_textos_site;
create policy "escrita dono update" on portfolio_textos_site for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');
drop policy if exists "escrita dono delete" on portfolio_textos_site;
create policy "escrita dono delete" on portfolio_textos_site for delete
  to authenticated using ((auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com');

-- ---------- Storage: bucket de imagens dos projetos ----------
-- O bucket é público pra leitura; só o dono pode enviar/apagar arquivo.
-- As policies filtram por bucket_id pra não afetar outros buckets
-- que o projeto Supabase compartilhado possa ter.

insert into storage.buckets (id, name, public)
values ('imagens-projetos', 'imagens-projetos', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio leitura publica imagens" on storage.objects;
create policy "portfolio leitura publica imagens" on storage.objects for select
  using (bucket_id = 'imagens-projetos');

drop policy if exists "portfolio upload dono imagens" on storage.objects;
create policy "portfolio upload dono imagens" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'imagens-projetos'
    and (auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com'
  );

drop policy if exists "portfolio delete dono imagens" on storage.objects;
create policy "portfolio delete dono imagens" on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'imagens-projetos'
    and (auth.jwt() ->> 'email') = 'joaopablosouzadias78@gmail.com'
  );

-- ---------- Textos iniciais (edita depois no admin) ----------

insert into portfolio_textos_site (chave, valor) values
  ('hero_frases', E'aplicações web completas.\ndo banco de dados à interface.\nprodutos que resolvem problemas reais.'),
  ('hero_texto', 'Transformo ideias em aplicações web funcionais, do banco de dados à interface. Foco em soluções simples que resolvem problemas de verdade.'),
  ('sobre', 'Sou desenvolvedor fullstack e construo aplicações web de ponta a ponta com React, Node e Supabase. Gosto de pegar um problema real, entender ele a fundo e entregar uma solução simples que funciona.'),
  ('contato_email', 'joaopablosouzadias78@gmail.com'),
  ('contato_github', 'https://github.com/Diasx7'),
  ('contato_linkedin', 'https://www.linkedin.com/in/')
on conflict (chave) do nothing;
