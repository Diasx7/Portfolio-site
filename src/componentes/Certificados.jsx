import { useState } from 'react'
import Lightbox from './Lightbox.jsx'

export default function Certificados({ certificados }) {
  const [imagemAberta, setImagemAberta] = useState(null)

  if (certificados.length === 0) return null

  function abrirImagem(cert) {
    setImagemAberta({
      url: cert.imagem,
      legenda: cert.plataforma ? `${cert.nome} — ${cert.plataforma}` : cert.nome,
    })
  }

  return (
    <section className="secao revelar" id="certificados">
      <h2 className="secao-titulo">Certificados</h2>
      <div className="grade-certificados">
        {certificados.map((cert) => (
          <article className="cartao-certificado" key={cert.id}>
            {cert.imagem && (
              <button
                type="button"
                className="certificado-capa"
                onClick={() => abrirImagem(cert)}
                aria-label={`Ver certificado ${cert.nome} em tamanho grande`}
              >
                <img src={cert.imagem} alt="" loading="lazy" />
              </button>
            )}
            <div className="cartao-certificado-corpo">
              <h3>{cert.nome}</h3>
              <p className="certificado-meta">
                {cert.plataforma}
                {cert.ano ? ` · ${cert.ano}` : ''}
              </p>
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noreferrer">
                  Ver certificado →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      {imagemAberta && <Lightbox imagens={[imagemAberta]} aoFechar={() => setImagemAberta(null)} />}
    </section>
  )
}
