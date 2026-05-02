'use client'

import { useApp } from '../context/AppContext'
import { ScreenBackground } from '../components/ScreenBackground'

export function Tela1() {
  const { setTelaAtual } = useApp()

  return (
    <ScreenBackground
      src="/backgrounds/tela1.png"
      onClick={() => setTelaAtual(2)}
    />
  )
}
