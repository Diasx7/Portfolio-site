import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import AbaProjetos from './AbaProjetos.jsx'
import AbaTecnologias from './AbaTecnologias.jsx'
import AbaCertificados from './AbaCertificados.jsx'
import AbaTextos from './AbaTextos.jsx'

const ABAS = [
  { id: 'projetos', rotulo: 'Projetos' },
  { id: 'tecnologias', rotulo: 'Tecnologias' },
  { id: 'certificados', rotulo: 'Certificados' },
  { id: 'textos', rotulo: 'Textos do site' },
]

export default function Painel() {
  const [abaAtiva, setAbaAtiva] = useState('projetos')

  return (
    <div className="admin">
      <header className="admin-topo">
        <h1>Painel do portfólio</h1>
        <div className="admin-topo-acoes">
          <a href="/" target="_blank" rel="noreferrer">Ver site</a>
          <button onClick={() => supabase.auth.signOut()}>Sair</button>
        </div>
      </header>

      <nav className="admin-abas">
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            className={abaAtiva === aba.id ? 'ativa' : ''}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.rotulo}
          </button>
        ))}
      </nav>

      <main className="admin-conteudo">
        {abaAtiva === 'projetos' && <AbaProjetos />}
        {abaAtiva === 'tecnologias' && <AbaTecnologias />}
        {abaAtiva === 'certificados' && <AbaCertificados />}
        {abaAtiva === 'textos' && <AbaTextos />}
      </main>
    </div>
  )
}
