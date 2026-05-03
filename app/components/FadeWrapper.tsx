'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeWrapperProps {
  children: React.ReactNode
  tela: number
}

export function FadeWrapper({ children, tela }: FadeWrapperProps) {
  const [displayed, setDisplayed] = useState(children)
  const [visible, setVisible] = useState(false)
  const pendingChildren = useRef(children)
  const isFirst = useRef(true)

  // Fade-in na primeira carga
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  // Crossfade nas trocas de tela
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }

    pendingChildren.current = children
    setVisible(false)

    const t = setTimeout(() => {
      setDisplayed(pendingChildren.current)
      setVisible(true)
    }, 250) // aguarda fade-out completar antes de trocar o conteúdo

    return () => clearTimeout(t)
  }, [tela]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="w-full h-full transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {displayed}
    </div>
  )
}
