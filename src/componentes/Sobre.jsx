export default function Sobre({ texto }) {
  return (
    <section className="secao revelar" id="sobre">
      <h2 className="secao-titulo">Sobre</h2>
      <div className="sobre-texto">
        {(texto || '').split('\n').filter(Boolean).map((paragrafo, i) => (
          <p key={i}>{paragrafo}</p>
        ))}
      </div>
    </section>
  )
}
