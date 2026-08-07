import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

// Campos editáveis e como aparecem no painel
const CAMPOS = [
  { chave: 'hero_frases', rotulo: 'Frases do efeito de digitação (uma por linha)', tipo: 'textarea' },
  { chave: 'hero_texto', rotulo: 'Texto de apresentação do hero', tipo: 'textarea' },
  { chave: 'sobre', rotulo: 'Texto do Sobre (linha em branco separa parágrafos)', tipo: 'textarea' },
  { chave: 'contato_email', rotulo: 'E-mail de contato', tipo: 'input' },
  { chave: 'contato_github', rotulo: 'Link do GitHub', tipo: 'input' },
  { chave: 'contato_linkedin', rotulo: 'Link do LinkedIn', tipo: 'input' },
]

export default function AbaTextos() {
  const [textos, setTextos] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [salvou, setSalvou] = useState(false)

  useEffect(() => {
    supabase.from('portfolio_textos_site').select('*').then(({ data }) => {
      const mapa = {}
      for (const linha of data || []) mapa[linha.chave] = linha.valor
      setTextos(mapa)
    })
  }, [])

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true)
    // Upsert de todos os campos de uma vez
    const linhas = CAMPOS.map(({ chave }) => ({ chave, valor: textos[chave] || '' }))
    await supabase.from('portfolio_textos_site').upsert(linhas)
    setSalvando(false)
    setSalvou(true)
    setTimeout(() => setSalvou(false), 2500)
  }

  return (
    <form className="admin-form" onSubmit={salvar}>
      <h2>Textos do site</h2>
      {CAMPOS.map(({ chave, rotulo, tipo }) => (
        <label key={chave}>
          {rotulo}
          {tipo === 'textarea' ? (
            <textarea
              rows={4}
              value={textos[chave] || ''}
              onChange={(e) => setTextos({ ...textos, [chave]: e.target.value })}
            />
          ) : (
            <input
              value={textos[chave] || ''}
              onChange={(e) => setTextos({ ...textos, [chave]: e.target.value })}
            />
          )}
        </label>
      ))}
      <div className="admin-form-acoes">
        <button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar tudo'}</button>
        {salvou && <span className="admin-ok">Salvo ✓</span>}
      </div>
    </form>
  )
}
