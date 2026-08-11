import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Modal genérico: fundo escurecido, imagem grande, legenda, botão de
// fechar (X ou clique fora) e navegação entre imagens (setas, teclado
// ou swipe) quando há mais de uma. `children` é o conteúdo extra que
// aparece abaixo da imagem (ex.: o painel de detalhes de um projeto).
// Usado tanto pelos projetos quanto pelos certificados.
//
// Renderizado via portal direto no <body>: se ficasse dentro da árvore
// normal, cairia dentro de alguma seção com a classe "revelar" (que usa
// transform pra animação de entrada) — e um ancestral com transform vira
// o "containing block" de elementos position:fixed, fazendo o modal ficar
// preso à posição/tamanho da seção em vez da viewport inteira.
export default function Lightbox({ imagens, indiceInicial = 0, inicial = '?', aoFechar, children }) {
  const [indice, setIndice] = useState(indiceInicial)
  const total = imagens.length
  const imagemAtual = imagens[indice]
  const toqueX = useRef(null)

  function anterior() {
    if (total < 2) return
    setIndice((i) => (i - 1 + total) % total)
  }

  function proxima() {
    if (total < 2) return
    setIndice((i) => (i + 1) % total)
  }

  // Trava o scroll da página e liga as setas do teclado enquanto o modal está aberto
  useEffect(() => {
    const overflowOriginal = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function aoTeclar(e) {
      if (e.key === 'Escape') aoFechar()
      else if (e.key === 'ArrowLeft') anterior()
      else if (e.key === 'ArrowRight') proxima()
    }
    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.body.style.overflow = overflowOriginal
      document.removeEventListener('keydown', aoTeclar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  function aoTocarInicio(e) {
    toqueX.current = e.touches[0].clientX
  }

  // Swipe simples na área da imagem: arrasta mais de 40px pro lado troca de imagem
  function aoTocarFim(e) {
    if (toqueX.current === null) return
    const delta = e.changedTouches[0].clientX - toqueX.current
    if (Math.abs(delta) > 40) {
      if (delta > 0) anterior()
      else proxima()
    }
    toqueX.current = null
  }

  return createPortal(
    <div className="modal-fundo" onClick={aoFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={aoFechar} aria-label="Fechar">
          ✕
        </button>

        {/* Só esse miolo rola quando o conteúdo é maior que a tela — o X fica de fora, sempre visível */}
        <div className="modal-corpo">
          <div className="modal-imagem-area" onTouchStart={aoTocarInicio} onTouchEnd={aoTocarFim}>
            {imagemAtual ? (
              <img src={imagemAtual.url} alt={imagemAtual.legenda || ''} />
            ) : (
              <div className="capa-vazia modal-imagem-vazia" data-inicial={inicial} aria-hidden="true" />
            )}
            {total > 1 && (
              <>
                <button
                  className="modal-seta modal-seta-esq"
                  onClick={(e) => {
                    e.stopPropagation()
                    anterior()
                  }}
                  aria-label="Imagem anterior"
                >
                  ‹
                </button>
                <button
                  className="modal-seta modal-seta-dir"
                  onClick={(e) => {
                    e.stopPropagation()
                    proxima()
                  }}
                  aria-label="Próxima imagem"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {imagemAtual?.legenda && <p className="modal-legenda-imagem">{imagemAtual.legenda}</p>}

          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
