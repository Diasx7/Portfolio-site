export default function Contato({ textos }) {
  return (
    <section className="secao revelar" id="contato">
      <h2 className="secao-titulo">Contato</h2>
      <p className="contato-chamada">Quer conversar sobre um projeto? Me chama:</p>
      <div className="contato-links">
        <a className="botao botao-secundario" href={textos.contato_github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="botao botao-secundario" href={textos.contato_linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="botao botao-primario" href={`mailto:${textos.contato_email}`}>
          {textos.contato_email}
        </a>
      </div>
    </section>
  )
}
