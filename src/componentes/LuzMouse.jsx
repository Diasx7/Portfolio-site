import { useEffect, useRef } from 'react'

// Luz ciano suave que segue o mouse no fundo da página.
// Desativada no mobile (sem mouse) e com prefers-reduced-motion.
export default function LuzMouse() {
  const ref = useRef(null)

  useEffect(() => {
    const temMouse = window.matchMedia('(pointer: fine)').matches
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!temMouse || reduzirMovimento) return

    let quadroAgendado = false
    const mover = (e) => {
      if (quadroAgendado) return
      quadroAgendado = true
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.setProperty('--luz-x', `${e.clientX}px`)
          ref.current.style.setProperty('--luz-y', `${e.clientY}px`)
        }
        quadroAgendado = false
      })
    }

    window.addEventListener('mousemove', mover)
    return () => window.removeEventListener('mousemove', mover)
  }, [])

  return <div className="luz-mouse" ref={ref} aria-hidden="true" />
}
