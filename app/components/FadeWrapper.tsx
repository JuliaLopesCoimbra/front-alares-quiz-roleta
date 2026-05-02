'use client'

import { useEffect, useState } from 'react'

interface FadeWrapperProps {
  children: React.ReactNode
  tela: number
}

export function FadeWrapper({ children, tela }: FadeWrapperProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [tela])

  return (
    <div
      className="w-full h-full transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  )
}
