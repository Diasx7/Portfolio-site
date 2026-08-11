import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

const CERT_VAZIO = { nome: '', plataforma: '', ano: '', link: '', imagem: '' }

export default function AbaCertificados() {
  const [certificados, setCertificados] = useState([])
  const [form, setForm] = useState(CERT_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [enviandoImagem, setEnviandoImagem] = useState(false)

  async function carregar() {
    const { data } = await supabase.from('portfolio_certificados').select('*').order('ano', { ascending: false })
    setCertificados(data || [])
  }

  useEffect(() => {
    carregar()
  }, [])

  function editar(cert) {
    setEditandoId(cert.id)
    setForm({ ...cert, ano: cert.ano || '', link: cert.link || '', imagem: cert.imagem || '' })
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
      imagem: form.imagem || null,
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

  // Sobe a imagem pro bucket (mesmo dos projetos) e guarda a URL pública crua no form.
  // Nada de JSON.stringify aqui — o valor salvo é a string da URL, direto.
  async function enviarImagem(e) {
    const arquivo = e.target.files?.[0]
    e.target.value = ''
    if (!arquivo) return

    setEnviandoImagem(true)
    const extensao = arquivo.name.split('.').pop()
    const caminho = `${crypto.randomUUID()}.${extensao}`
    const { error } = await supabase.storage.from('imagens-projetos').upload(caminho, arquivo)

    if (!error) {
      const { data } = supabase.storage.from('imagens-projetos').getPublicUrl(caminho)
      // Já tinha uma imagem? Apaga a antiga do bucket antes de trocar
      if (form.imagem) {
        const caminhoAntigo = form.imagem.split('/imagens-projetos/')[1]
        if (caminhoAntigo) await supabase.storage.from('imagens-projetos').remove([caminhoAntigo])
      }
      setForm((f) => ({ ...f, imagem: data.publicUrl }))
      // Certificado já existe: salva a imagem na hora, sem esperar o Salvar
      if (editandoId) {
        await supabase.from('portfolio_certificados').update({ imagem: data.publicUrl }).eq('id', editandoId)
      }
    }
    setEnviandoImagem(false)
  }

  // Apaga a imagem do bucket e tira ela do form
  async function removerImagem() {
    const caminho = form.imagem?.split('/imagens-projetos/')[1]
    if (caminho) await supabase.storage.from('imagens-projetos').remove([caminho])

    setForm((f) => ({ ...f, imagem: '' }))
    if (editandoId) {
      await supabase.from('portfolio_certificados').update({ imagem: null }).eq('id', editandoId)
    }
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
        <label>
          Imagem do certificado
          <input type="file" accept="image/*" onChange={enviarImagem} disabled={enviandoImagem} />
        </label>
        {enviandoImagem && <p className="admin-imagem-status">Enviando imagem…</p>}
        {form.imagem && (
          <div className="admin-imagens">
            <div className="admin-imagem-item">
              <img src={form.imagem} alt="" />
              <button type="button" onClick={removerImagem}>Remover</button>
            </div>
          </div>
        )}
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
