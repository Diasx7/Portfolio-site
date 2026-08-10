import { useEffect, useRef, useState } from 'react'

function CartaoProjeto({ projeto, principal, aoAbrirImagem }) {
  const emAndamento = projeto.status === 'em_andamento'

  return (
    <article
      className={
        'cartao-projeto' +
        (principal ? ' cartao-principal' : '') +
        (emAndamento ? ' cartao-andamento' : '')
      }
    >
      {projeto.imagens?.length > 0 && (
        <button
          type="button"
          className="cartao-capa"
          onClick={() => aoAbrirImagem(projeto.imagens, 0)}
          aria-label={`Ver imagens do projeto ${projeto.nome}`}
        >
          <img src={projeto.imagens[0].url} alt="" loading="lazy" />
        </button>
      )}
      <div className="cartao-topo">
        <h3>{projeto.nome}</h3>
        <div className="badges">
          {principal && <span className="badge badge-principal">Projeto principal</span>}
          {emAndamento && <span className="badge badge-andamento">Em andamento</span>}
        </div>
      </div>
      <p className="cartao-descricao">{projeto.descricao}</p>
      <ul className="cartao-tags">
        {(projeto.tags || []).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="cartao-links">
        {projeto.link_demo && (
          <a href={projeto.link_demo} target="_blank" rel="noreferrer">
            Ver ao vivo →
          </a>
        )}
        {projeto.link_codigo && (
          <a href={projeto.link_codigo} target="_blank" rel="noreferrer">
            Código
          </a>
        )}
      </div>
      {/* Barrinha tipo loading na base dos cards em andamento */}
      {emAndamento && <div className="barra-loading" aria-hidden="true" />}
    </article>
  )
}

// Modal com a imagem grande, legenda e navegação entre as imagens do projeto
function Lightbox({ imagens, indiceInicial, aoFechar }) {
  const [indice, setIndice] = useState(indiceInicial)
  const total = imagens.length
  const imagem = imagens[indice]
  const toqueX = useRef(null)

  function anterior() {
    setIndice((i) => (i - 1 + total) % total)
  }

  function proxima() {
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

  // Swipe simples: arrasta mais de 40px pro lado troca de imagem
  function aoTocarFim(e) {
    if (toqueX.current === null) return
    const delta = e.changedTouches[0].clientX - toqueX.current
    if (Math.abs(delta) > 40) {
      if (delta > 0) anterior()
      else proxima()
    }
    toqueX.current = null
  }

  return (
    <div className="lightbox-fundo" onClick={aoFechar}>
      <button className="lightbox-fechar" onClick={aoFechar} aria-label="Fechar">
        ✕
      </button>
      {total > 1 && (
        <button
          className="lightbox-seta lightbox-seta-esq"
          onClick={(e) => {
            e.stopPropagation()
            anterior()
          }}
          aria-label="Imagem anterior"
        >
          ‹
        </button>
      )}
      <div
        className="lightbox-conteudo"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={aoTocarInicio}
        onTouchEnd={aoTocarFim}
      >
        <img src={imagem.url} alt={imagem.legenda || ''} />
        {imagem.legenda && <p className="lightbox-legenda">{imagem.legenda}</p>}
      </div>
      {total > 1 && (
        <button
          className="lightbox-seta lightbox-seta-dir"
          onClick={(e) => {
            e.stopPropagation()
            proxima()
          }}
          aria-label="Próxima imagem"
        >
          ›
        </button>
      )}
    </div>
  )
}

export default function Projetos({ projetos }) {
  const [lightbox, setLightbox] = useState(null)
  const principal = projetos.find((p) => p.destaque)
  const demais = projetos.filter((p) => !p.destaque)

  function abrirImagem(imagens, indice) {
    setLightbox({ imagens, indice })
  }

  return (
    <section className="secao revelar" id="projetos">
      <h2 className="secao-titulo">Projetos</h2>
      <div className="grade-projetos">
        {principal && <CartaoProjeto projeto={principal} principal aoAbrirImagem={abrirImagem} />}
        {demais.map((p) => (
          <CartaoProjeto key={p.id} projeto={p} aoAbrirImagem={abrirImagem} />
        ))}
      </div>
      {projetos.length === 0 && <p className="vazio">Projetos em breve.</p>}
      {lightbox && (
        <Lightbox
          imagens={lightbox.imagens}
          indiceInicial={lightbox.indice}
          aoFechar={() => setLightbox(null)}
        />
      )}
    </section>
  )
}
