function CartaoProjeto({ projeto, principal }) {
  const emAndamento = projeto.status === 'em_andamento'

  return (
    <article
      className={
        'cartao-projeto' +
        (principal ? ' cartao-principal' : '') +
        (emAndamento ? ' cartao-andamento' : '')
      }
    >
      {projeto.imagens?.length > 0 && (
        <div className="cartao-capa">
          <img src={projeto.imagens[0]} alt="" loading="lazy" />
        </div>
      )}
      <div className="cartao-topo">
        <h3>{projeto.nome}</h3>
        <div className="badges">
          {principal && <span className="badge badge-principal">Projeto principal</span>}
          {emAndamento && <span className="badge badge-andamento">Em andamento</span>}
        </div>
      </div>
      <p className="cartao-descricao">{projeto.descricao}</p>
      <ul className="cartao-tags">
        {(projeto.tags || []).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="cartao-links">
        {projeto.link_demo && (
          <a href={projeto.link_demo} target="_blank" rel="noreferrer">
            Ver ao vivo →
          </a>
        )}
        {projeto.link_codigo && (
          <a href={projeto.link_codigo} target="_blank" rel="noreferrer">
            Código
          </a>
        )}
      </div>
      {/* Barrinha tipo loading na base dos cards em andamento */}
      {emAndamento && <div className="barra-loading" aria-hidden="true" />}
    </article>
  )
}

export default function Projetos({ projetos }) {
  const principal = projetos.find((p) => p.destaque)
  const demais = projetos.filter((p) => !p.destaque)

  return (
    <section className="secao revelar" id="projetos">
      <h2 className="secao-titulo">Projetos</h2>
      <div className="grade-projetos">
        {principal && <CartaoProjeto projeto={principal} principal />}
        {demais.map((p) => (
          <CartaoProjeto key={p.id} projeto={p} />
        ))}
      </div>
      {projetos.length === 0 && <p className="vazio">Projetos em breve.</p>}
    </section>
  )
}
