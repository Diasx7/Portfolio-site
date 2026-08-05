function GrupoChips({ titulo, itens }) {
  if (itens.length === 0) return null
  return (
    <div className="grupo-tecnologias">
      <h3>{titulo}</h3>
      <ul className="chips">
        {itens.map((tec, i) => (
          <li
            key={tec.id}
            className="chip"
            // Cada chip flutua com um tempo diferente pra não ficarem sincronizados
            style={{ '--atraso': `${(i % 6) * -1.3}s` }}
          >
            {tec.nome}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Tecnologias({ tecnologias }) {
  const domino = tecnologias.filter((t) => t.grupo === 'domino')
  const tambemUso = tecnologias.filter((t) => t.grupo === 'tambem_uso')

  return (
    <section className="secao revelar" id="tecnologias">
      <h2 className="secao-titulo">Tecnologias</h2>
      <GrupoChips titulo="Domino" itens={domino} />
      <GrupoChips titulo="Também uso" itens={tambemUso} />
    </section>
  )
}
