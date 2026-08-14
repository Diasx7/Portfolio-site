// Cabeçalho padrão de seção: título à esquerda, marcador "(0N_SECTION)"
// à direita em mono, com uma linha fina separando do conteúdo abaixo.
export default function CabecalhoSecao({ titulo, numero }) {
  return (
    <div className="cabecalho-secao">
      <h2 className="cabecalho-secao-titulo">{titulo}</h2>
      <span className="cabecalho-secao-marcador" aria-hidden="true">
        ({String(numero).padStart(2, '0')}_SECTION)
      </span>
    </div>
  )
}
