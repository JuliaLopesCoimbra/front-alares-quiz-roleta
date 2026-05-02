'use client'

import { useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { ScreenBackground } from '../components/ScreenBackground'

export function Tela6() {
  const { resetContexto } = useApp()

  const handleReset = useCallback(() => {
    resetContexto()
  }, [resetContexto])

  useEffect(() => {
    const t = setTimeout(handleReset, 10_000)
    return () => clearTimeout(t)
  }, [handleReset])

  return (
    <ScreenBackground src="/backgrounds/tela6.png" onClick={handleReset} />
  )
}
