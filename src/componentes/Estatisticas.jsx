import NumeroAnimado from './NumeroAnimado.jsx'

function rotuloContagem(n, singular, plural) {
  return n === 1 ? singular : plural
}

// Faixa de células com contagens reais do banco (projetos, certificados,
// tecnologias) + uma célula de status fixo editável. Célula de contagem
// só aparece se o total for >= 3 — número baixo passa impressão ruim.
export default function Estatisticas({ totalProjetos, totalCertificados, totalTecnologias, statusTexto }) {
  const celulas = []

  if (totalProjetos >= 3) {
    celulas.push({
      chave: 'projetos',
      numero: totalProjetos,
      rotulo: rotuloContagem(totalProjetos, 'Projeto', 'Projetos'),
    })
  }
  if (totalCertificados >= 3) {
    celulas.push({
      chave: 'certificados',
      numero: totalCertificados,
      rotulo: rotuloContagem(totalCertificados, 'Certificado', 'Certificados'),
    })
  }
  if (totalTecnologias >= 3) {
    celulas.push({
      chave: 'tecnologias',
      numero: totalTecnologias,
      rotulo: rotuloContagem(totalTecnologias, 'Linguagem', 'Linguagens'),
    })
  }

  return (
    <div className="estatisticas">
      {celulas.map((c) => (
        <div className="estatistica-celula" key={c.chave}>
          <span className="estatistica-numero">
            <NumeroAnimado valor={c.numero} />
          </span>
          <span className="estatistica-rotulo">{c.rotulo}</span>
        </div>
      ))}
      <div className="estatistica-celula">
        <span className="estatistica-numero estatistica-texto">{statusTexto || 'Aberto'}</span>
        <span className="estatistica-rotulo">Status</span>
      </div>
    </div>
  )
}
