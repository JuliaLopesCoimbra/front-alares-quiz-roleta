'use client'

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

  const handleContinuar = () => {
    setTelaAtual(cidadeAtendida ? 6 : 7)
  }

  const icon = brindeGanho ? PRIZE_ICONS[brindeGanho] : null

  return (
    <ScreenBackground src="/backgrounds/tela5.png">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pb-12">

        <div className="text-center leading-snug">
          <p style={{ fontSize: 'clamp(3rem, 7vh, 6rem)', fontWeight: 700, color: 'white' }}>
            Parabéns!
          </p>
          <p style={{ fontSize: 'clamp(3rem, 7vh, 6rem)', fontWeight: 700, color: '#00f6a5' }}>
            Você ganhou:
          </p>
        </div>

        {icon && (
          <div className="flex flex-col items-center gap-4">
            <p style={{ fontSize: 'clamp(1.8rem, 4vh, 3.4rem)', fontWeight: 700, color: 'white', textAlign: 'center' }}>
              {brindeGanho}
            </p>
            <img
              src={icon}
              alt={brindeGanho ?? ''}
              draggable={false}
              style={{
                width: 'clamp(180px, 30vw, 380px)',
                height: 'clamp(180px, 30vw, 380px)',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        <button
          onClick={handleContinuar}
          className="font-bold uppercase tracking-wider active:scale-95 transition-transform"
          style={{
            background: '#00f6a5',
            color: '#042d1e',
            border: 'none',
            borderRadius: '16px',
            padding: 'clamp(16px, 2.5vh, 36px) clamp(50px, 10vw, 130px)',
            fontSize: 'clamp(1.4rem, 3vh, 2.6rem)',
            letterSpacing: '0.06em',
          }}
        >
          CONTINUAR
        </button>

      </div>
    </ScreenBackground>
  )
}
