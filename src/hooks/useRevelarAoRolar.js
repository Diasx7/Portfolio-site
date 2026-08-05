import { useEffect } from 'react'

// Faz as seções com a classe .revelar aparecerem com fade + subida
// quando entram na tela (IntersectionObserver)
export default function useRevelarAoRolar(dependencias = []) {
  useEffect(() => {
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elementos = document.querySelectorAll('.revelar')

    if (reduzirMovimento) {
      elementos.forEach((el) => el.classList.add('visivel'))
      return
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel')
            observador.unobserve(entrada.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    elementos.forEach((el) => observador.observe(el))
    return () => observador.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias)
}
