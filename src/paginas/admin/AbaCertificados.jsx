import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

const CERT_VAZIO = { nome: '', plataforma: '', ano: '', link: '' }

export default function AbaCertificados() {
  const [certificados, setCertificados] = useState([])
  const [form, setForm] = useState(CERT_VAZIO)
  const [editandoId, setEditandoId] = useState(null)

  async function carregar() {
    const { data } = await supabase.from('portfolio_certificados').select('*').order('ano', { ascending: false })
    setCertificados(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  function editar(cert) {
    setEditandoId(cert.id)
    setForm({ ...cert, ano: cert.ano || '', link: cert.link || '' })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(CERT_VAZIO)
  }

  async function salvar(e) {
    e.preventDefault()
    const dados = {
      nome: form.nome,
      plataforma: form.plataforma,
      ano: form.ano ? Number(form.ano) : null,
      link: form.link || null,
    }
    if (editandoId) {
      await supabase.from('portfolio_certificados').update(dados).eq('id', editandoId)
    } else {
      await supabase.from('portfolio_certificados').insert(dados)
    }
    cancelar()
    carregar()
  }

  async function excluir(id) {
    if (!confirm('Excluir esse certificado?')) return
    await supabase.from('portfolio_certificados').delete().eq('id', id)
    carregar()
  }

  return (
    <div>
      <form className="admin-form" onSubmit={salvar}>
        <h2>{editandoId ? 'Editar certificado' : 'Novo certificado'}</h2>
        <div className="admin-form-linha">
          <label>
            Nome do curso
            <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          </label>
          <label>
            Plataforma
            <input value={form.plataforma} onChange={(e) => setForm({ ...form, plataforma: e.target.value })} placeholder="Udemy, Alura…" />
          </label>
        </div>
        <div className="admin-form-linha">
          <label>
            Ano
            <input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} placeholder="2025" />
          </label>
          <label>
            Link do certificado
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://…" />
          </label>
        </div>
        <div className="admin-form-acoes">
          <button type="submit">Salvar</button>
          {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>

      <ul className="admin-lista">
        {certificados.map((c) => (
          <li key={c.id}>
            <div className="item-info">
              <strong>{c.nome}</strong>
              <span className="item-meta">{c.plataforma}{c.ano ? ` · ${c.ano}` : ''}</span>
            </div>
            <div className="item-acoes">
              <button onClick={() => editar(c)}>Editar</button>
              <button className="perigo" onClick={() => excluir(c.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
      {certificados.length === 0 && <p>Nenhum certificado cadastrado ainda.</p>}
    </div>
  )
}
