import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import Login from './Login.jsx'
import Painel from './Painel.jsx'
import '../../styles/admin.css'

export default function Admin() {
  const [sessao, setSessao] = useState(undefined) // undefined = ainda verificando

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessao(data.session))

    // Mantém o estado atualizado quando loga/desloga
    const { data: escuta } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao)
    })
    return () => escuta.subscription.unsubscribe()
  }, [])

  if (sessao === undefined) return <div className="admin-carregando">Carregando…</div>
  if (!sessao) return <Login />
  return <Painel />
}
