import { useState } from 'react'
import Lightbox from './Lightbox.jsx'

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
  const imagens = (projeto.imagens || []).map(imagemDe)
  const emAndamento = projeto.status === 'em_andamento'

  return (
    <Lightbox imagens={imagens} inicial={inicialDe(projeto.nome)} aoFechar={aoFechar}>
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
    </Lightbox>
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
