'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { ScreenBackground } from '../components/ScreenBackground'

const PRIZE_ICONS: Record<string, string> = {
  'Sacola e Caneta':   '/prizes/icon-sacola.png',
  'Caderno Moleskine': '/prizes/icon-caderno.png',
  'Garrafa Térmica':   '/prizes/icon-garrafa.png',
  'Mochila Térmica':   '/prizes/icon-mochila.png',
}

export function Tela5() {
  const { brindeGanho, cidadeAtendida, setTelaAtual } = useApp()

  const [isTotem, setIsTotem] = useState(false)
  useEffect(() => {
    const check = () => setIsTotem(window.innerWidth >= 1080)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleContinuar = () => {
    setTelaAtual(cidadeAtendida ? 6 : 7)
  }

  const icon = brindeGanho ? PRIZE_ICONS[brindeGanho] : null

  return (
    <ScreenBackground src="/backgrounds/tela5.png">
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pb-12"
        style={{ gap: isTotem ? '5vh' : '1.5rem' }}
      >

        <div className="text-center flex flex-col" style={{ gap: isTotem ? '0.4vh' : '0.25rem' }}>
          <p
            className="font-bold"
            style={{ color: 'white', fontSize: isTotem ? 'clamp(3rem,7vh,6rem)' : '1.6rem' }}
          >
            Parabéns!
          </p>
          <p
            className="font-bold"
            style={{ color: '#00f6a5', fontSize: isTotem ? 'clamp(3rem,7vh,6rem)' : '1.6rem' }}
          >
            Você ganhou:
          </p>
        </div>

        {brindeGanho && (
          <p
            className="font-bold"
            style={{ color: 'white', textAlign: 'center', fontSize: isTotem ? 'clamp(3rem,6vh,5.5rem)' : '1.6rem' }}
          >
            {brindeGanho}
          </p>
        )}

        <button
          onClick={handleContinuar}
          className="font-bold uppercase tracking-wider active:scale-95 transition-transform"
          style={{
            background: '#00f6a5',
            color: '#042d1e',
            border: 'none',
            borderRadius: '12px',
            padding: isTotem ? 'clamp(18px, 3vh, 48px) clamp(50px, 10vw, 160px)' : '14px 40px',
            fontSize: isTotem ? 'clamp(1.6rem,3.2vh,3rem)' : '1.1rem',
            letterSpacing: '0.06em',
          }}
        >
          CONTINUAR
        </button>

      </div>
    </ScreenBackground>
  )
}
