import Estatisticas from './Estatisticas.jsx'

export default function Hero({ textos, projetos, certificados, tecnologias }) {
  return (
    <section className="hero" id="inicio">
      <span className="hero-selo">
        <span className="hero-selo-bolinha" aria-hidden="true" />
        Disponível para estágio
      </span>

      <h1 className="hero-nome">
        <span className="hero-nome-linha1">João</span>
        <span className="hero-nome-linha2">Pablo</span>
      </h1>

      <p className="hero-descricao">{textos.hero_texto}</p>

      <div className="hero-botoes">
        <a className="botao botao-primario" href="#projetos">
          Ver projetos
        </a>
        <a className="botao botao-secundario" href="#contato">
          Entrar em contato
        </a>
      </div>

      <Estatisticas
        totalProjetos={projetos.length}
        totalCertificados={certificados.length}
        totalTecnologias={tecnologias.length}
        statusTexto={textos.disponibilidade}
      />
    </section>
  )
}
