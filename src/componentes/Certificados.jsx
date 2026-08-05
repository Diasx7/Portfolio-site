export default function Certificados({ certificados }) {
  if (certificados.length === 0) return null

  return (
    <section className="secao revelar" id="certificados">
      <h2 className="secao-titulo">Certificados</h2>
      <div className="grade-certificados">
        {certificados.map((cert) => (
          <article className="cartao-certificado" key={cert.id}>
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
          </article>
        ))}
      </div>
    </section>
  )
}
