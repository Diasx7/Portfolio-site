import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

const PROJETO_VAZIO = {
  nome: '',
  descricao: '',
  tags: '',
  link_demo: '',
  link_codigo: '',
  status: 'concluido',
  destaque: false,
  visivel: true,
}

export default function AbaProjetos() {
  const [projetos, setProjetos] = useState([])
  const [form, setForm] = useState(PROJETO_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    const { data } = await supabase.from('portfolio_projetos').select('*').order('ordem')
    setProjetos(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  function editar(projeto) {
    setEditandoId(projeto.id)
    setForm({ ...projeto, tags: (projeto.tags || []).join(', ') })
    window.scrollTo({ top: 0 })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(PROJETO_VAZIO)
  }

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true)

    const dados = {
      nome: form.nome,
      descricao: form.descricao,
      // Tags separadas por vírgula viram lista
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      link_demo: form.link_demo || null,
      link_codigo: form.link_codigo || null,
      status: form.status,
      destaque: form.destaque,
      visivel: form.visivel,
    }

    // Só um projeto pode ser destaque por vez
    if (dados.destaque) {
      await supabase.from('portfolio_projetos').update({ destaque: false }).eq('destaque', true)
    }

    if (editandoId) {
      await supabase.from('portfolio_projetos').update(dados).eq('id', editandoId)
    } else {
      dados.ordem = projetos.length
      await supabase.from('portfolio_projetos').insert(dados)
    }

    setSalvando(false)
    cancelar()
    carregar()
  }

  async function excluir(id) {
    if (!confirm('Excluir esse projeto?')) return
    await supabase.from('portfolio_projetos').delete().eq('id', id)
    carregar()
  }

  async function alternar(projeto, campo) {
    await supabase.from('portfolio_projetos').update({ [campo]: !projeto[campo] }).eq('id', projeto.id)
    carregar()
  }

  // Troca a ordem com o vizinho de cima ou de baixo
  async function mover(indice, direcao) {
    const vizinho = indice + direcao
    if (vizinho < 0 || vizinho >= projetos.length) return
    const a = projetos[indice]
    const b = projetos[vizinho]
    await Promise.all([
      supabase.from('portfolio_projetos').update({ ordem: b.ordem }).eq('id', a.id),
      supabase.from('portfolio_projetos').update({ ordem: a.ordem }).eq('id', b.id),
    ])
    carregar()
  }

  return (
    <div>
      <form className="admin-form" onSubmit={salvar}>
        <h2>{editandoId ? 'Editar projeto' : 'Novo projeto'}</h2>
        <label>
          Nome
          <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </label>
        <label>
          Descrição (uma linha: o problema que resolve)
          <input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
        </label>
        <label>
          Tags de stack (separadas por vírgula)
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, Supabase, Vercel" />
        </label>
        <div className="admin-form-linha">
          <label>
            Link demo
            <input value={form.link_demo || ''} onChange={(e) => setForm({ ...form, link_demo: e.target.value })} placeholder="https://…" />
          </label>
          <label>
            Link código
            <input value={form.link_codigo || ''} onChange={(e) => setForm({ ...form, link_codigo: e.target.value })} placeholder="https://github.com/…" />
          </label>
        </div>
        <div className="admin-form-linha">
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="concluido">Concluído</option>
              <option value="em_andamento">Em andamento</option>
            </select>
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={form.destaque} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} />
            Projeto principal (destaque)
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={form.visivel} onChange={(e) => setForm({ ...form, visivel: e.target.checked })} />
            Visível no site
          </label>
        </div>
        <div className="admin-form-acoes">
          <button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
          {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>

      <ul className="admin-lista">
        {projetos.map((p, i) => (
          <li key={p.id} className={p.visivel ? '' : 'item-oculto'}>
            <div className="item-info">
              <strong>{p.nome}</strong>
              <span className="item-meta">
                {p.destaque && '⭐ destaque · '}
                {p.status === 'em_andamento' ? 'em andamento' : 'concluído'}
                {!p.visivel && ' · oculto'}
              </span>
            </div>
            <div className="item-acoes">
              <button onClick={() => mover(i, -1)} disabled={i === 0} title="Subir">↑</button>
              <button onClick={() => mover(i, 1)} disabled={i === projetos.length - 1} title="Descer">↓</button>
              <button onClick={() => alternar(p, 'visivel')}>{p.visivel ? 'Ocultar' : 'Mostrar'}</button>
              <button onClick={() => editar(p)}>Editar</button>
              <button className="perigo" onClick={() => excluir(p.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
      {projetos.length === 0 && <p>Nenhum projeto cadastrado ainda.</p>}
    </div>
  )
}
