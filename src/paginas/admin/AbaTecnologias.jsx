import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

export default function AbaTecnologias() {
  const [tecnologias, setTecnologias] = useState([])
  const [nome, setNome] = useState('')
  const [grupo, setGrupo] = useState('domino')
  const [editandoId, setEditandoId] = useState(null)

  async function carregar() {
    const { data } = await supabase.from('portfolio_tecnologias').select('*').order('ordem')
    setTecnologias(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  function editar(tec) {
    setEditandoId(tec.id)
    setNome(tec.nome)
    setGrupo(tec.grupo)
  }

  function cancelar() {
    setEditandoId(null)
    setNome('')
    setGrupo('domino')
  }

  async function salvar(e) {
    e.preventDefault()
    if (editandoId) {
      await supabase.from('portfolio_tecnologias').update({ nome, grupo }).eq('id', editandoId)
    } else {
      await supabase.from('portfolio_tecnologias').insert({ nome, grupo, ordem: tecnologias.length })
    }
    cancelar()
    carregar()
  }

  async function excluir(id) {
    if (!confirm('Excluir essa tecnologia?')) return
    await supabase.from('portfolio_tecnologias').delete().eq('id', id)
    carregar()
  }

  async function mover(indice, direcao) {
    const vizinho = indice + direcao
    if (vizinho < 0 || vizinho >= tecnologias.length) return
    const a = tecnologias[indice]
    const b = tecnologias[vizinho]
    await Promise.all([
      supabase.from('portfolio_tecnologias').update({ ordem: b.ordem }).eq('id', a.id),
      supabase.from('portfolio_tecnologias').update({ ordem: a.ordem }).eq('id', b.id),
    ])
    carregar()
  }

  return (
    <div>
      <form className="admin-form" onSubmit={salvar}>
        <h2>{editandoId ? 'Editar tecnologia' : 'Nova tecnologia'}</h2>
        <div className="admin-form-linha">
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="React" />
          </label>
          <label>
            Grupo
            <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
              <option value="domino">Domino</option>
              <option value="tambem_uso">Também uso</option>
            </select>
          </label>
        </div>
        <div className="admin-form-acoes">
          <button type="submit">Salvar</button>
          {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>

      <ul className="admin-lista">
        {tecnologias.map((t, i) => (
          <li key={t.id}>
            <div className="item-info">
              <strong>{t.nome}</strong>
              <span className="item-meta">{t.grupo === 'domino' ? 'Domino' : 'Também uso'}</span>
            </div>
            <div className="item-acoes">
              <button onClick={() => mover(i, -1)} disabled={i === 0} title="Subir">↑</button>
              <button onClick={() => mover(i, 1)} disabled={i === tecnologias.length - 1} title="Descer">↓</button>
              <button onClick={() => editar(t)}>Editar</button>
              <button className="perigo" onClick={() => excluir(t.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
      {tecnologias.length === 0 && <p>Nenhuma tecnologia cadastrada ainda.</p>}
    </div>
  )
}
