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
          <p className="font-bold text-lg totem:text-[clamp(3rem,7vh,6rem)]" style={{ color: 'white' }}>
            Parabéns!
          </p>
          <p className="font-bold text-lg totem:text-[clamp(3rem,7vh,6rem)]" style={{ color: '#00f6a5' }}>
            Você ganhou:
          </p>
        </div>

        {icon && (
          <div className="flex flex-col items-center gap-2">
            <p className="font-bold text-sm totem:text-[clamp(1.8rem,4vh,3.4rem)]" style={{ color: 'white', textAlign: 'center' }}>
              {brindeGanho}
            </p>
            <img
              src={icon}
              alt={brindeGanho ?? ''}
              draggable={false}
              style={{
                width: 'clamp(80px, 28vw, 380px)',
                height: 'clamp(80px, 28vw, 380px)',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        <button
          onClick={handleContinuar}
          className="font-bold uppercase tracking-wider active:scale-95 transition-transform text-sm totem:text-[clamp(1.4rem,3vh,2.6rem)]"
          style={{
            background: '#00f6a5',
            color: '#042d1e',
            border: 'none',
            borderRadius: '12px',
            padding: 'clamp(8px, 2vh, 36px) clamp(20px, 8vw, 130px)',
            letterSpacing: '0.06em',
          }}
        >
          CONTINUAR
        </button>

      </div>
    </ScreenBackground>
  )
}
