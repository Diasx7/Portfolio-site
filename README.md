# Portfólio — João Pablo

Portfólio pessoal com página pública animada e painel admin pra editar todo o conteúdo.

**Stack:** React + Vite · Supabase (banco + auth) · CSS puro · Deploy na Vercel

## Rotas

- `/` — página pública (hero, projetos, tecnologias, certificados, sobre, contato)
- `/admin` — painel de administração (login com Supabase Auth)

## O que tu precisa fazer manualmente (uma vez só)

### 1. Criar o projeto no Supabase

1. Entra em [supabase.com](https://supabase.com) e cria um projeto novo
2. Em **Settings → API**, copia a **Project URL** e a **anon public key**
3. Cola os dois valores no arquivo `.env` daqui da pasta:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

### 2. Rodar o SQL do banco

1. No painel do Supabase, abre o **SQL Editor**
2. Cola o conteúdo inteiro de [`supabase/schema.sql`](supabase/schema.sql) e roda
3. Isso cria as tabelas, o RLS (leitura pública / escrita só logado) e os textos iniciais

### 3. Criar teu usuário admin

1. No painel do Supabase: **Authentication → Users → Add user → Create new user**
2. Usa teu e-mail e uma senha forte
3. Marca **Auto Confirm User** (senão ele fica esperando confirmação por e-mail)
4. Pronto — é com esse e-mail/senha que tu loga em `/admin`

### 4. Rodar localmente

```
npm install
npm run dev
```

Abre `http://localhost:5173`. Entra em `/admin`, loga e cadastra teus projetos, tecnologias e certificados. Aproveita e ajusta o link do LinkedIn na aba **Textos do site** (tá com placeholder).

### 5. Deploy na Vercel

1. Sobe o projeto pro GitHub (o `.env` já está no `.gitignore`, não vai junto)
2. Na Vercel: **New Project → importa o repositório** (ela detecta Vite sozinha)
3. Em **Environment Variables**, adiciona as mesmas duas variáveis do `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. O `vercel.json` já cuida do redirecionamento da rota `/admin`

## Segurança

- Nenhuma chave no código — tudo vem do `.env` (local) ou das variáveis de ambiente (Vercel)
- `.env` está no `.gitignore`; o `.env.example` mostra quais variáveis existem, sem valores
- A anon key é pública por natureza (vai pro navegador de qualquer forma) — quem protege a escrita no banco é o RLS: só usuário autenticado consegue alterar dados
- Antes de commitar, confere: `git status` não pode listar `.env`
