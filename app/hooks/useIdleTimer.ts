'use client'

import { useEffect, useRef, useCallback } from 'react'

const IDLE_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
]

export function useIdleTimer(
  timeout: number,
  onIdle: () => void,
  onActive: () => void
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isIdleRef = useRef(false)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (isIdleRef.current) {
      isIdleRef.current = false
      onActive()
    }

    timerRef.current = setTimeout(() => {
      isIdleRef.current = true
      onIdle()
    }, timeout)
  }, [timeout, onIdle, onActive])

  useEffect(() => {
    IDLE_EVENTS.forEach(event => window.addEventListener(event, resetTimer))
    resetTimer()
    return () => {
      IDLE_EVENTS.forEach(event => window.removeEventListener(event, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resetTimer])
}
