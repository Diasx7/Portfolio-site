import { useEffect, useState } from 'react'

// Efeito de digitação: escreve e apaga as frases em sequência
export default function useDigitacao(frases, velocidade = 70, pausa = 2000) {
  const [texto, setTexto] = useState('')
  const [indiceFrase, setIndiceFrase] = useState(0)
  const [apagando, setApagando] = useState(false)

  useEffect(() => {
    if (!frases || frases.length === 0) return

    // Com movimento reduzido, mostra a primeira frase parada
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTexto(frases[0])
      return
    }

    const fraseAtual = frases[indiceFrase % frases.length]
    let timer

    if (!apagando) {
      if (texto.length < fraseAtual.length) {
        timer = setTimeout(() => setTexto(fraseAtual.slice(0, texto.length + 1)), velocidade)
      } else {
        timer = setTimeout(() => setApagando(true), pausa)
      }
    } else {
      if (texto.length > 0) {
        timer = setTimeout(() => setTexto(texto.slice(0, -1)), velocidade / 2)
      } else {
        setApagando(false)
        setIndiceFrase((i) => (i + 1) % frases.length)
      }
    }

    return () => clearTimeout(timer)
  }, [texto, apagando, indiceFrase, frases, velocidade, pausa])

  return texto
}
