import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

// Conta de 0 até `valor` quando o elemento entra na tela, uma vez só.
// Com prefers-reduced-motion, mostra o valor final direto, sem animar.
export default function NumeroAnimado({ valor, duracao = 1000 }) {
  const [exibido, setExibido] = useState(0)
  const ref = useRef(null)
  const jaAnimou = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setExibido(valor)
      return
    }

    const elemento = ref.current
    if (!elemento) return

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting || jaAnimou.current) return
          jaAnimou.current = true

          const inicio = performance.now()
          function passo(agora) {
            const progresso = Math.min((agora - inicio) / duracao, 1)
            setExibido(Math.round(easeOutCubic(progresso) * valor))
            if (progresso < 1) requestAnimationFrame(passo)
          }
          requestAnimationFrame(passo)
          observador.unobserve(elemento)
        })
      },
      { threshold: 0.3 }
    )

    observador.observe(elemento)
    return () => observador.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor])

  return <span ref={ref}>{exibido}</span>
}
