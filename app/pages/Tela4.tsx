'use client'

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ScreenBackground } from '../components/ScreenBackground'
import { api } from '../services/api'

// Ângulo central de cada segmento (graus, sentido horário a partir do topo)
// Segmentos em sentido horário, 90° cada, primeiro segmento centrado em 45°
const SEGMENT_ANGLES: Record<string, number> = {
  'Sacola e Caneta':   45,
  'Caderno Moleskine': 135,
  'Garrafa Térmica':   225,
  'Mochila Térmica':   315,
}

function calcFinalAngle(currentAngle: number, brinde: string): number {
  const segmentCenter = SEGMENT_ANGLES[brinde] ?? 0
  const spins = 5 + Math.floor(Math.random() * 4) // 5–8 voltas
  // Para trazer o segmento ao topo (0°), rotacionar por (360 - center)
  const targetOffset = (360 - segmentCenter + 360) % 360
  const currentMod = ((currentAngle % 360) + 360) % 360
  const diff = (targetOffset - currentMod + 360) % 360
  return currentAngle + spins * 360 + diff
}

export function Tela4() {
  const { leadId, setBrindeGanho, setTelaAtual } = useApp()
  const [girando, setGirando] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [transition, setTransition] = useState('none')
  const [erro, setErro] = useState<string | null>(null)

  const handleGirar = async () => {
    if (!leadId || girando) return
    setErro(null)
    setGirando(true)

    const baseRotation = rotation

    // Arranca imediatamente: meia volta suave enquanto API é chamada
    setTransition('transform 1s ease-in')
    setRotation(baseRotation + 180)

    try {
      const res = await api.girarRoleta(leadId)

      // API respondeu: continua do ponto atual até o segmento correto
      const finalAngle = calcFinalAngle(baseRotation, res.brinde)
      setTransition('transform 4s ease-out')
      setRotation(finalAngle)

      // Aguarda fim da animação (4s) + 3s para visualizar o resultado
      await new Promise(resolve => setTimeout(resolve, 7200))
      setBrindeGanho(res.brinde)
      setTelaAtual(5)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErro(e.message || 'Erro ao girar a roleta')
      setGirando(false)
      setTransition('none')
    }
  }

  return (
    <ScreenBackground src="/backgrounds/tela4.png">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 totem:gap-12">

        {/* Texto acima da roleta */}
        <div className="text-center flex flex-col totem:gap-10" style={{ marginTop: '4vh' }}>
          <p className="font-bold text-xl totem:text-[clamp(2.2rem,5vh,4.2rem)]" style={{ color: 'white' }}>
            É o seu momento!
          </p>
          <p className="font-medium text-xl totem:text-[clamp(2.2rem,5vh,4.2rem)]" style={{ color: '#00f6a5' }}>
            Gire a roleta e ganhe:
          </p>
        </div>

        {/* Wrapper roleta + ponteiro */}
        <div style={{ position: 'relative', display: 'inline-block' }}>

          {/* Roleta girando */}
          <img
            src="/roulette/roleta.png"
            alt="Roleta"
            draggable={false}
            style={{
              width: 'clamp(260px, 80vw, 820px)',
              height: 'clamp(260px, 80vw, 820px)',
              display: 'block',
              transform: `rotate(${rotation}deg)`,
              transition,
              userSelect: 'none',
            }}
          />

          {/* Ponteiro — fixo, sobre o topo da roleta */}
          <img
            src="/roulette/ponteiro.png"
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(30px, 8vw, 100px)',
              zIndex: 10,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </div>

        {erro && (
          <p className="text-red-300 text-sm bg-black/40 rounded-lg px-6 py-2">{erro}</p>
        )}

        {!girando && (
          <button
            onClick={handleGirar}
            className="font-bold uppercase active:scale-95 transition-transform"
            style={{
              background: '#00f6a5',
              color: '#042d1e',
              border: 'none',
              borderRadius: '20px',
              padding: 'clamp(10px, 2.5vh, 40px) clamp(24px, 8vw, 130px)',
              fontSize: 'clamp(0.95rem, 3vh, 3rem)',
              letterSpacing: '0.04em',
            }}
          >
            Quero tentar a sorte!
          </button>
        )}

      </div>
    </ScreenBackground>
  )
}
