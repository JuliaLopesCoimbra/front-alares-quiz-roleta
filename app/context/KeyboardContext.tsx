'use client'

import { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from 'react'

type KeyboardMode = 'text' | 'numeric'

interface KeyboardContextType {
  isOpen: boolean
  mode: KeyboardMode
  keyboardHeight: number
  openKeyboard: (input: HTMLInputElement, mode?: KeyboardMode) => void
  closeKeyboard: () => void
  pressKey: (key: string) => void
}

const KeyboardContext = createContext<KeyboardContextType | null>(null)

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<KeyboardMode>('text')
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const activeInputRef = useRef<HTMLInputElement | null>(null)
  const nativeSetterRef = useRef<((v: string) => void) | null>(null)

  useEffect(() => {
    nativeSetterRef.current = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set ?? null
  }, [])

  const openKeyboard = useCallback((input: HTMLInputElement, kbMode: KeyboardMode = 'text') => {
    activeInputRef.current = input
    setMode(kbMode)
    setIsOpen(true)
    setTimeout(() => input.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }, [])

  const closeKeyboard = useCallback(() => {
    setIsOpen(false)
    activeInputRef.current?.blur()
    activeInputRef.current = null
  }, [])

  const pressKey = useCallback((key: string) => {
    const input = activeInputRef.current
    const setter = nativeSetterRef.current
    if (!input || !setter) return

    const current = input.value
    let next: string

    if (key === 'BACKSPACE') {
      next = current.slice(0, -1)
    } else if (key === 'SPACE') {
      next = current + ' '
    } else {
      next = current + key
    }

    setter.call(input, next)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, [])

  return (
    <KeyboardContext.Provider value={{ isOpen, mode, keyboardHeight, openKeyboard, closeKeyboard, pressKey }}>
      {children}
    </KeyboardContext.Provider>
  )
}

export function useKeyboard() {
  const ctx = useContext(KeyboardContext)
  if (!ctx) throw new Error('useKeyboard must be used inside KeyboardProvider')
  return ctx
}
