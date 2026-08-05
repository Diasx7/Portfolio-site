import { createClient } from '@supabase/supabase-js'

// As chaves vêm do .env — nunca colocar valores direto aqui
const url = import.meta.env.VITE_SUPABASE_URL
const chaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !chaveAnon) {
  console.error('Faltam as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env')
}

// O fallback evita a página quebrar em branco enquanto o .env não está preenchido
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  chaveAnon || 'placeholder'
)
