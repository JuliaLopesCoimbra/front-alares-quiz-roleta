'use client'

import { useState } from 'react'
import { useKeyboard } from '../context/KeyboardContext'

type View = 'letters' | 'symbols'

const LETTER_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
]

const SYMBOL_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['-','/',':',';','(',')','"','@','&','%'],
  ['.','_',',','?','!','#','\'','~'],
]

const NUMPAD_ROWS = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
]

const kb: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  background: 'rgba(6, 14, 42, 0.98)',
  borderTop: '1px solid rgba(255,255,255,0.12)',
  padding: '12px 14px 18px',
  backdropFilter: 'blur(12px)',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '7px',
  justifyContent: 'center',
}

function Key({
  label,
  onPress,
  flex = 1,
  color = 'rgba(255,255,255,0.13)',
  textColor = 'white',
  border = '1px solid rgba(255,255,255,0.22)',
  fontSize,
  bold = false,
}: {
  label: string
  onPress: () => void
  flex?: number
  color?: string
  textColor?: string
  border?: string
  fontSize?: string
  bold?: boolean
}) {
  return (
    <div
      onPointerDown={e => { e.preventDefault(); onPress() }}
      style={{
        flex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'clamp(58px, 7.2vh, 82px)',
        borderRadius: '12px',
        background: color,
        border,
        color: textColor,
        fontSize: fontSize ?? 'clamp(1rem, 2.4vh, 1.9rem)',
        fontWeight: bold ? 700 : 500,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        minWidth: 0,
        transition: 'background 0.1s',
      }}
    >
      {label}
    </div>
  )
}

export function VirtualKeyboard() {
  const { mode, pressKey, closeKeyboard } = useKeyboard()
  const [caps, setCaps] = useState(false)
  const [view, setView] = useState<View>('letters')

  const dim = 'rgba(255,255,255,0.08)'
  const red = 'rgba(220,60,60,0.3)'
  const green = '#00f6a5'

  if (mode === 'numeric') {
    return (
      <div style={kb}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxWidth: 380, margin: '0 auto' }}>
          {NUMPAD_ROWS.map((row, i) => (
            <div key={i} style={rowStyle}>
              {row.map(k => <Key key={k} label={k} onPress={() => pressKey(k)} />)}
            </div>
          ))}
          <div style={rowStyle}>
            <Key label="⌫" onPress={() => pressKey('BACKSPACE')} color={red} border="none" />
            <Key label="0" onPress={() => pressKey('0')} />
            <Key label="OK ✓" onPress={closeKeyboard} color={green} textColor="#108277" border="none" bold />
          </div>
        </div>
      </div>
    )
  }

  const rows = view === 'letters' ? LETTER_ROWS : SYMBOL_ROWS
  const toKey = (k: string) => view === 'letters' ? (caps ? k.toUpperCase() : k.toLowerCase()) : k

  return (
    <div style={kb}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>

        {/* Row 0 — letras/simbolos */}
        <div style={rowStyle}>
          {rows[0].map(k => <Key key={k} label={toKey(k)} onPress={() => pressKey(toKey(k))} />)}
          <Key label="⌫" onPress={() => pressKey('BACKSPACE')} flex={1.4} color={red} border="none" />
        </div>

        {/* Row 1 — letras/simbolos */}
        <div style={rowStyle}>
          {rows[1].map(k => <Key key={k} label={toKey(k)} onPress={() => pressKey(toKey(k))} />)}
        </div>

        {/* Row 2 — CAPS + letras/simbolos + BACKSPACE */}
        <div style={rowStyle}>
          <Key
            label={caps ? '⇪' : '⇧'}
            onPress={() => setCaps(c => !c)}
            flex={1.5}
            color={caps ? 'rgba(0,246,165,0.28)' : dim}
            border={caps ? '1px solid rgba(0,246,165,0.6)' : '1px solid rgba(255,255,255,0.22)'}
            fontSize="clamp(1.1rem, 2.4vh, 1.9rem)"
          />
          {rows[2].map(k => <Key key={k} label={toKey(k)} onPress={() => pressKey(toKey(k))} />)}
          <Key label="⌫" onPress={() => pressKey('BACKSPACE')} flex={1.5} color={red} border="none" />
        </div>

        {/* Row 3 — toggle + espaço + ok */}
        <div style={rowStyle}>
          <Key
            label={view === 'letters' ? '123' : 'ABC'}
            onPress={() => setView(v => v === 'letters' ? 'symbols' : 'letters')}
            flex={1.5}
            color={dim}
            fontSize="clamp(0.8rem, 1.8vh, 1.4rem)"
          />
          <Key label="," onPress={() => pressKey(',')} flex={0.8} />
          <Key label="espaço" onPress={() => pressKey('SPACE')} flex={4.5} color={dim} fontSize="clamp(0.85rem, 1.8vh, 1.3rem)" />
          <Key label="." onPress={() => pressKey('.')} flex={0.8} />
          <Key label="OK ✓" onPress={closeKeyboard} flex={1.6} color={green} textColor="#108277" border="none" bold fontSize="clamp(0.9rem, 1.9vh, 1.5rem)" />
        </div>

      </div>
    </div>
  )
}
