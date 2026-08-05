# Portfolio

Meu site de portfólio pessoal. Página pública com meus projetos, tecnologias e certificados, e um painel admin onde eu edito todo o conteúdo sem precisar mexer no código.

🔗 **Ver no ar:** [coloca-o-link-da-vercel-aqui]

## O que tem

- Página pública com efeito de digitação no título, animações de scroll e tema escuro
- Todo o conteúdo (projetos, tecnologias, certificados e textos) vem do banco
- Painel admin em `/admin` com login pra gerenciar tudo
- Responsivo

## Stack

- React + Vite
- Supabase (banco, auth)
- Deploy na Vercel

## Rodando local

```bash
npm install
npm run dev
```

Antes de rodar, cria um arquivo `.env` na raiz copiando o `.env.example` e preenche com os dados do teu projeto no Supabase:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Banco

O SQL das tabelas tá em `supabase/schema.sql`. É só colar no SQL Editor do Supabase e executar.

As tabelas têm RLS: qualquer um pode ler, mas só usuário logado pode escrever. O usuário do admin é criado direto no painel do Supabase (Authentication → Users), não tem cadastro pelo site.

## Estrutura

```
src/
  componentes/   -> seções da página pública
  paginas/
    PaginaPublica.jsx
    admin/       -> painel administrativo
  hooks/         -> efeito de digitação e revelar ao rolar
  lib/           -> conexão com o supabase
  styles/
supabase/
  schema.sql
```
