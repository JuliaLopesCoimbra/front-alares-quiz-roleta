'use client'

import { useApp } from './context/AppContext'
import { FadeWrapper } from './components/FadeWrapper'
import { Tela1 } from './pages/Tela1'
import { Tela2 } from './pages/Tela2'
import { Tela3 } from './pages/Tela3'
import { Tela4 } from './pages/Tela4'
import { Tela5 } from './pages/Tela5'
import { Tela6 } from './pages/Tela6'
import { Tela7 } from './pages/Tela7'

const TELAS = [Tela1, Tela2, Tela3, Tela4, Tela5, Tela6, Tela7]

export default function Home() {
  const { telaAtual } = useApp()
  const TelaAtiva = TELAS[telaAtual - 1]

  return (
    <FadeWrapper tela={telaAtual}>
      <TelaAtiva />
    </FadeWrapper>
  )
}
