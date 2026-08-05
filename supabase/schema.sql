-- =============================================================
-- Schema do portfólio — rodar no SQL Editor do painel do Supabase
-- =============================================================

-- ---------- Tabelas ----------

create table if not exists projetos (
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
  criado_em timestamptz not null default now()
);

create table if not exists tecnologias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  grupo text not null default 'domino' check (grupo in ('domino', 'tambem_uso')),
  ordem integer not null default 0
);

create table if not exists certificados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  plataforma text not null default '',
  ano integer,
  link text
);

-- Textos editáveis do site (chave/valor)
create table if not exists textos_site (
  chave text primary key,
  valor text not null default ''
);

-- ---------- RLS: leitura pública, escrita só autenticado ----------

alter table projetos enable row level security;
alter table tecnologias enable row level security;
alter table certificados enable row level security;
alter table textos_site enable row level security;

-- Leitura liberada pra todo mundo (site público)
create policy "leitura publica" on projetos for select using (true);
create policy "leitura publica" on tecnologias for select using (true);
create policy "leitura publica" on certificados for select using (true);
create policy "leitura publica" on textos_site for select using (true);

-- Escrita só pra usuário logado (o admin)
create policy "escrita autenticada" on projetos for all
  to authenticated using (true) with check (true);
create policy "escrita autenticada" on tecnologias for all
  to authenticated using (true) with check (true);
create policy "escrita autenticada" on certificados for all
  to authenticated using (true) with check (true);
create policy "escrita autenticada" on textos_site for all
  to authenticated using (true) with check (true);

-- ---------- Textos iniciais (edita depois no admin) ----------

insert into textos_site (chave, valor) values
  ('hero_frases', E'aplicações web completas.\ndo banco de dados à interface.\nprodutos que resolvem problemas reais.'),
  ('hero_texto', 'Transformo ideias em aplicações web funcionais, do banco de dados à interface. Foco em soluções simples que resolvem problemas de verdade.'),
  ('sobre', 'Sou desenvolvedor fullstack e construo aplicações web de ponta a ponta com React, Node e Supabase. Gosto de pegar um problema real, entender ele a fundo e entregar uma solução simples que funciona.'),
  ('contato_email', 'joaopablosouzadias78@gmail.com'),
  ('contato_github', 'https://github.com/Diasx7'),
  ('contato_linkedin', 'https://www.linkedin.com/in/')
on conflict (chave) do nothing;
