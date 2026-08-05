import useDigitacao from '../hooks/useDigitacao.js'

export default function Hero({ textos, projetoPrincipal }) {
  // Frases do efeito de digitação vêm do banco, uma por linha
  const frases = (textos.hero_frases || 'aplicações web completas.')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)

  const textoDigitado = useDigitacao(frases)

  return (
    <section className="hero" id="inicio">
      <p className="hero-cargo">Desenvolvedor Fullstack</p>
      <h1 className="hero-titulo">
        Eu construo{' '}
        <span className="hero-digitado">
          {textoDigitado}
          <span className="cursor" aria-hidden="true" />
        </span>
      </h1>
      <p className="hero-texto">{textos.hero_texto}</p>
      <div className="hero-botoes">
        {projetoPrincipal?.link_demo && (
          <a className="botao botao-primario" href={projetoPrincipal.link_demo} target="_blank" rel="noreferrer">
            Ver projeto principal ao vivo
          </a>
        )}
        <a className="botao botao-secundario" href={textos.contato_github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="botao botao-secundario" href={textos.contato_linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </section>
  )
}
