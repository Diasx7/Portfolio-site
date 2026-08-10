import { useEffect, useRef, useState } from 'react'

function inicialDe(nome) {
  return nome?.trim()?.[0]?.toUpperCase() || '?'
}

// Aceita tanto o formato novo {url, legenda} quanto uma URL direto em texto
// (dado antigo, de antes da migração pra jsonb)
function imagemDe(item) {
  return typeof item === 'string' ? { url: item, legenda: '' } : item
}

// Card só com a capa e o nome; todo o resto fica escondido até clicar
function CartaoProjeto({ projeto, principal, aoAbrir }) {
  const capa = imagemDe(projeto.imagens?.[0])

  return (
    <button
      type="button"
      className={'cartao-projeto' + (principal ? ' cartao-principal' : '')}
      onClick={() => aoAbrir(projeto)}
      aria-label={`Ver detalhes do projeto ${projeto.nome}`}
    >
      {capa ? (
        <img className="cartao-capa-img" src={capa.url} alt="" loading="lazy" />
      ) : (
        <div className="capa-vazia cartao-capa-vazia" data-inicial={inicialDe(projeto.nome)} aria-hidden="true" />
      )}
      <div className="cartao-nome-faixa">
        <h3>{projeto.nome}</h3>
      </div>
    </button>
  )
}

// Modal com todas as informações do projeto: imagens navegáveis, descrição, tags, status e links
function ModalProjeto({ projeto, aoFechar }) {
  const [indice, setIndice] = useState(0)
  const imagens = (projeto.imagens || []).map(imagemDe)
  const total = imagens.length
  const imagemAtual = imagens[indice]
  const emAndamento = projeto.status === 'em_andamento'
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

  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={aoFechar} aria-label="Fechar">
          ✕
        </button>

        <div className="modal-imagem-area" onTouchStart={aoTocarInicio} onTouchEnd={aoTocarFim}>
          {imagemAtual ? (
            <img src={imagemAtual.url} alt={imagemAtual.legenda || ''} />
          ) : (
            <div className="capa-vazia modal-imagem-vazia" data-inicial={inicialDe(projeto.nome)} aria-hidden="true" />
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

        <div className="modal-info">
          <div className="modal-info-topo">
            <h3>{projeto.nome}</h3>
            {emAndamento && <span className="badge badge-andamento">Em andamento</span>}
          </div>
          <p className="cartao-descricao">{projeto.descricao}</p>
          {projeto.tags?.length > 0 && (
            <ul className="cartao-tags">
              {projeto.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
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
        </div>
      </div>
    </div>
  )
}

export default function Projetos({ projetos }) {
  const [projetoAberto, setProjetoAberto] = useState(null)
  const principal = projetos.find((p) => p.destaque)
  const demais = projetos.filter((p) => !p.destaque)

  return (
    <section className="secao revelar" id="projetos">
      <h2 className="secao-titulo">Projetos</h2>
      <div className="grade-projetos">
        {principal && <CartaoProjeto projeto={principal} principal aoAbrir={setProjetoAberto} />}
        {demais.map((p) => (
          <CartaoProjeto key={p.id} projeto={p} aoAbrir={setProjetoAberto} />
        ))}
      </div>
      {projetos.length === 0 && <p className="vazio">Projetos em breve.</p>}
      {projetoAberto && <ModalProjeto projeto={projetoAberto} aoFechar={() => setProjetoAberto(null)} />}
    </section>
  )
}
