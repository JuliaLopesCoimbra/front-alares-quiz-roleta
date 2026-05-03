'use client'

import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useIdleTimer } from '../hooks/useIdleTimer'
import { Screensaver } from './Screensaver'

const IDLE_TIMEOUT_MS = 60_000

export function ScreensaverOverlay() {
  const pathname = usePathname()
  const [showScreensaver, setShowScreensaver] = useState(false)

  const onIdle = useCallback(() => setShowScreensaver(true), [])
  const onActive = useCallback(() => setShowScreensaver(false), [])

  useIdleTimer(IDLE_TIMEOUT_MS, onIdle, onActive)

  if (pathname === '/dashboard') return null

  return (
    <Screensaver
      visible={showScreensaver}
      onClick={() => setShowScreensaver(false)}
    />
  )
}
