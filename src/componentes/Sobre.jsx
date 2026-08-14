import CabecalhoSecao from './CabecalhoSecao.jsx'

export default function Sobre({ texto, statusTexto }) {
  return (
    <section className="secao revelar" id="sobre">
      <CabecalhoSecao titulo="Sobre" numero={1} />
      <div className="sobre-grade">
        <pre className="sobre-codigo" aria-hidden="true">
          <code>
            <span className="tok-chave">const</span> <span className="tok-var">dev</span> = {'{'}
            {'\n'}  <span className="tok-prop">nome</span>: <span className="tok-string">'João Pablo'</span>,
            {'\n'}  <span className="tok-prop">foco</span>: <span className="tok-string">'Fullstack'</span>,
            {'\n'}  <span className="tok-prop">status</span>: <span className="tok-string">'{statusTexto || 'Disponível'}'</span>,
            {'\n'}
            {'}'}
          </code>
        </pre>
        <div className="sobre-texto">
          {(texto || '').split('\n').filter(Boolean).map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
