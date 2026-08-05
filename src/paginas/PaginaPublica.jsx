import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import useRevelarAoRolar from '../hooks/useRevelarAoRolar.js'
import LuzMouse from '../componentes/LuzMouse.jsx'
import Hero from '../componentes/Hero.jsx'
import Projetos from '../componentes/Projetos.jsx'
import Tecnologias from '../componentes/Tecnologias.jsx'
import Certificados from '../componentes/Certificados.jsx'
import Sobre from '../componentes/Sobre.jsx'
import Contato from '../componentes/Contato.jsx'
import '../styles/publica.css'

export default function PaginaPublica() {
  const [dados, setDados] = useState(null)

  useEffect(() => {
    async function carregar() {
      // Busca tudo em paralelo
      const [projetos, tecnologias, certificados, textos] = await Promise.all([
        supabase.from('projetos').select('*').eq('visivel', true).order('ordem'),
        supabase.from('tecnologias').select('*').order('ordem'),
        supabase.from('certificados').select('*').order('ano', { ascending: false }),
        supabase.from('textos_site').select('*'),
      ])

      // Transforma os textos em um objeto { chave: valor }
      const textosMapa = {}
      for (const linha of textos.data || []) textosMapa[linha.chave] = linha.valor

      setDados({
        projetos: projetos.data || [],
        tecnologias: tecnologias.data || [],
        certificados: certificados.data || [],
        textos: textosMapa,
      })
    }
    carregar()
  }, [])

  // Reaplica o observador quando os dados chegam (as seções são renderizadas depois)
  useRevelarAoRolar([dados])

  if (!dados) {
    return <div className="pagina carregando-pagina" aria-busy="true" />
  }

  const { projetos, tecnologias, certificados, textos } = dados
  const projetoPrincipal = projetos.find((p) => p.destaque)

  return (
    <div className="pagina">
      <LuzMouse />
      <main>
        <Hero textos={textos} projetoPrincipal={projetoPrincipal} />
        <Projetos projetos={projetos} />
        <Tecnologias tecnologias={tecnologias} />
        <Certificados certificados={certificados} />
        <Sobre texto={textos.sobre} />
        <Contato textos={textos} />
      </main>
      <footer className="rodape">
        <p>© {new Date().getFullYear()} João Pablo — feito com React e Supabase</p>
      </footer>
    </div>
  )
}
