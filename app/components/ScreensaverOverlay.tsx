'use client'

import { useState, useCallback } from 'react'
import { useIdleTimer } from '../hooks/useIdleTimer'
import { Screensaver } from './Screensaver'

const IDLE_TIMEOUT_MS = 30_000

export function ScreensaverOverlay() {
  const [showScreensaver, setShowScreensaver] = useState(false)

  const onIdle = useCallback(() => setShowScreensaver(true), [])
  const onActive = useCallback(() => setShowScreensaver(false), [])

  useIdleTimer(IDLE_TIMEOUT_MS, onIdle, onActive)

  return (
    <Screensaver
      visible={showScreensaver}
      onClick={() => setShowScreensaver(false)}
    />
  )
}
