'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quiz-roulette.picbrand.com.br'

const ESTADO_NOMES: Record<string, string> = {
  BA: 'Bahia', CE: 'Ceará', MG: 'Minas Gerais',
  PB: 'Paraíba', PR: 'Paraná', RN: 'Rio Grande do Norte', SP: 'São Paulo',
}

export default function CitiesPage() {
  const [data, setData] = useState<Record<string, string[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/api/cidades/atendidas`)
      .then(r => { if (!r.ok) throw new Error(`Erro ${r.status}`); return r.json() })
      .then(setData)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }, [])

  const totalCidades = data ? Object.values(data).reduce((s, v) => s + v.length, 0) : 0
  const totalEstados = data ? Object.keys(data).length : 0

  const dadosFiltrados = data
    ? Object.fromEntries(
        Object.entries(data)
          .map(([uf, cidades]) => [uf, busca ? cidades.filter(c => c.toLowerCase().includes(busca.toLowerCase())) : cidades])
          .filter(([, cidades]) => (cidades as string[]).length > 0)
      ) as Record<string, string[]>
    : {}

  const pad = isMobile ? '16px' : '40px 32px'

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: pad, fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-start', marginBottom: 24, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>Cidades Atendidas</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.9rem' }}>Alares — cobertura de rede</p>
          {data && (
            <p style={{ color: '#059669', margin: '6px 0 0', fontSize: '0.85rem', fontWeight: 600 }}>
              {totalEstados} estados · {totalCidades} cidades
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/pessoas-atendidas" style={{ background: '#059669', color: 'white', border: 'none', borderRadius: 10, padding: '9px 16px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block' }}>
            👥 Pessoas Atendidas
          </Link>
          <Link href="/dashboard" style={{ background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 10, padding: '9px 16px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block' }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: 24 }}>
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar cidade..."
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 16px', fontSize: '0.95rem', outline: 'none', width: '100%', maxWidth: isMobile ? '100%' : 360, color: '#111827', background: 'white' }}
        />
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Carregando...</p>}
      {erro && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '12px 16px', borderRadius: 8 }}>{erro}</p>}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {Object.entries(dadosFiltrados).map(([uf, cidades]) => (
            <div key={uf} style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: '#f0fdf4', borderBottom: '1px solid #d1fae5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46' }}>{uf}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', marginLeft: 8 }}>{ESTADO_NOMES[uf] ?? ''}</span>
                </div>
                <span style={{ background: '#059669', color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {cidades.length}
                </span>
              </div>
              <div style={{ padding: '6px 0' }}>
                {cidades.map(cidade => (
                  <div key={cidade} style={{ padding: '7px 18px', fontSize: '0.88rem', color: '#374151', borderBottom: '1px solid #f9fafb' }}>
                    {cidade}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
