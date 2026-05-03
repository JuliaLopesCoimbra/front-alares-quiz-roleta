'use client'

import { useState, useRef, useEffect } from 'react'

interface AutocompleteFieldProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  onInputFocus?: (el: HTMLInputElement) => void
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}

function normalize(str: string) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function AutocompleteField({
  value,
  onChange,
  options,
  placeholder = 'Digite a cidade...',
  disabled = false,
  required = false,
  onInputFocus,
  inputMode = 'none',
}: AutocompleteFieldProps) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = open
    ? (query.length >= 1
        ? options.filter(o => normalize(o).includes(normalize(query))).slice(0, 80)
        : options.slice(0, 80))
    : []

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery(value)
      }
    }
    // mousedown only — touchstart would fire before onPointerDown.preventDefault()
    // on virtual keyboard keys, incorrectly closing the dropdown
    document.addEventListener('mousedown', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
    }
  }, [value])

  const fieldHeight = 'clamp(56px, 5vh, 90px)'
  const fontSize = 'clamp(1rem, 2vh, 1.6rem)'
  const showDropdown = open && filtered.length > 0

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        required={required}
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          onChange('')
          setOpen(true)
        }}
        onFocus={e => { setOpen(true); onInputFocus?.(e.currentTarget) }}
        disabled={disabled}
        placeholder={disabled ? '' : placeholder}
        autoComplete="off"
        inputMode={inputMode}
        style={{
          width: '100%',
          height: fieldHeight,
          borderRadius: showDropdown ? '16px 16px 0 0' : '16px',
          padding: '0 20px',
          fontSize,
          background: 'white',
          border: 'none',
          outline: 'none',
          color: 'black',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />

      {showDropdown && (
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
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}
        >
          {filtered.map(city => (
            <div
              key={city}
              onPointerDown={e => {
                e.preventDefault()
                onChange(city)
                setQuery(city)
                setOpen(false)
              }}
              style={{
                padding: 'clamp(10px, 1.5vh, 20px) 20px',
                fontSize,
                color: city === value ? '#108277' : '#111',
                background: city === value ? '#e6fff8' : 'white',
                fontWeight: city === value ? 700 : 400,
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              {city}
            </div>
          ))}
        </div>
      )}

      {/* Garante validação nativa do form */}
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
