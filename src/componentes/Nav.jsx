// Barra de navegação flutuante fixa no topo. Os links são âncoras pra
// seções da própria página — o scroll suave já vem do `scroll-behavior:
// smooth` global, sem precisar de JS.
export default function Nav() {
  return (
    <nav className="nav-flutuante">
      <a href="#inicio" className="nav-logo">
        <span className="nav-logo-barras">//</span> JP
      </a>
      <div className="nav-links">
        <a href="#sobre">Sobre</a>
        <a href="#projetos">Projetos</a>
        <a href="#certificados">Certificados</a>
        <a href="#tecnologias">Skills</a>
        <a href="#contato" className="nav-link-destaque">
          Contato
        </a>
      </div>
    </nav>
  )
}
