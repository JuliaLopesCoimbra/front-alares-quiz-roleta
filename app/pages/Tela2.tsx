'use client'

import { useApp } from '../context/AppContext'
import { ScreenBackground } from '../components/ScreenBackground'

export function Tela2() {
  const { setTipoLead, setTelaAtual } = useApp()

  const handleSim = () => {
    setTipoLead('isp')
    setTelaAtual(3)
  }

  const handleNao = () => {
    setTipoLead('empresa')
    setTelaAtual(3)
  }

  return (
    <ScreenBackground src="/backgrounds/tela2.png">
      <div className="absolute bottom-[12%] totem:bottom-[34%] left-0 right-0 flex flex-col items-center gap-6 totem:gap-6 px-8 totem:px-12">
        <button
          onClick={handleSim}
          className="w-full max-w-xs py-3 text-xl font-bold rounded-3xl active:scale-95 transition-transform totem:max-w-[520px] totem:py-[3rem] totem:text-[3.6rem]"
          style={{ background: '#00c484', color: '#001f5b', border: 'none' }}
        >
          SIM
        </button>
        <button
          onClick={handleNao}
          className="w-full max-w-xs py-3 text-xl  rounded-3xl active:scale-95 transition-transform totem:max-w-[520px] totem:py-[3rem] totem:text-[3.5rem]"
          style={{ background: 'transparent', border: '2px solid white', color: 'white' }}
        >
          NÃO
        </button>
      </div>
    </ScreenBackground>
  )
}
