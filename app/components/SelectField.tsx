'use client'

import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = '',
  disabled = false,
  required = false,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const fieldHeight = 'clamp(56px, 5vh, 90px)'
  const fontSize = 'clamp(1rem, 2vh, 1.6rem)'

  return (
    <div ref={containerRef} className="relative w-full" style={{ userSelect: 'none' }}>
      {/* Campo visível */}
      <div
        onClick={() => !disabled && setOpen(prev => !prev)}
        style={{
          width: '100%',
          height: fieldHeight,
          borderRadius: open ? '16px 16px 0 0' : '16px',
          padding: '0 40px 0 20px',
          fontSize,
          background: 'white',
          border: 'none',
          color: selected ? 'black' : '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {selected ? selected.label : placeholder}
      </div>

      {/* Seta */}
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          color: '#6b7280',
          fontSize: 'clamp(0.7rem, 1.2vh, 1rem)',
          transform: `translateY(-50%) rotate(${open ? '180deg' : '0deg'})`,
          transition: 'transform 0.2s',
        }}
      >
        ▼
      </span>

      {/* Lista de opções */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '0 0 16px 16px',
            zIndex: 9999,
            maxHeight: 'clamp(200px, 30vh, 400px)',
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {options.map(opt => (
            <div
              key={opt.value}
              onPointerDown={e => {
                e.preventDefault()
                onChange(opt.value)
                setOpen(false)
              }}
              style={{
                padding: 'clamp(10px, 1.5vh, 20px) 20px',
                fontSize,
                color: opt.value === value ? '#108277' : 'black',
                background: opt.value === value ? '#e6fff8' : 'white',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: opt.value === value ? 700 : 400,
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {/* Input hidden para validação nativa do form */}
      {required && (
        <input
          tabIndex={-1}
          required
          value={value}
          onChange={() => {}}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        />
      )}
    </div>
  )
}
