'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface BrindeContagem {
  nome: string
  cota_por_dia: number
  dia_1: number
  dia_2: number
  dia_3: number
  total: number
}

interface HistoricoItem {
  id: number
  brinde: string
  participante: string
  empresa: string
  dia_evento: number
  sorteado_em: string
}

interface DashboardData {
  contagens: BrindeContagem[]
  historico: HistoricoItem[]
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

const th: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#6b7280',
  borderBottom: '2px solid #e5e7eb',
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '0.95rem',
  borderBottom: '1px solid #f3f4f6',
  color: '#111827',
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtro, setFiltro] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setErro(null)
    try {
      const res = await fetch(`${API_URL}/api/dashboard`)
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      setData(await res.json())
    } catch (e: unknown) {
      setErro((e as Error).message || 'Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const historicoFiltrado = data?.historico.filter(h =>
    !filtro ||
    h.brinde.toLowerCase().includes(filtro.toLowerCase()) ||
    h.participante.toLowerCase().includes(filtro.toLowerCase()) ||
    h.empresa.toLowerCase().includes(filtro.toLowerCase())
  ) ?? []

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 32px', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.95rem' }}>Alares Roleta Quiz — controle de sorteios</p>
        </div>
        <button
          onClick={fetchData}
          style={{
            background: '#00f6a5', color: '#042d1e', border: 'none',
            borderRadius: 10, padding: '10px 24px', fontWeight: 700,
            fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          ↺ Atualizar
        </button>
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Carregando...</p>}
      {erro && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '12px 16px', borderRadius: 8 }}>{erro}</p>}

      {data && (
        <>
          {/* ── Tabela de contagens ── */}
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 40, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Brindes sorteados</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Brinde</th>
                    <th style={{ ...th, textAlign: 'center' }}>Dia 1</th>
                    <th style={{ ...th, textAlign: 'center' }}>Dia 2</th>
                    <th style={{ ...th, textAlign: 'center' }}>Dia 3</th>
                    <th style={{ ...th, textAlign: 'center' }}>Total</th>
                    <th style={{ ...th, textAlign: 'center' }}>Cota/dia</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contagens.map(b => (
                    <tr key={b.nome} style={{ transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                    >
                      <td style={{ ...td, fontWeight: 600 }}>{b.nome}</td>
                      <td style={{ ...td, textAlign: 'center' }}>{b.dia_1}</td>
                      <td style={{ ...td, textAlign: 'center' }}>{b.dia_2}</td>
                      <td style={{ ...td, textAlign: 'center' }}>{b.dia_3}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: '#059669' }}>{b.total}</td>
                      <td style={{ ...td, textAlign: 'center', color: '#6b7280' }}>{b.cota_por_dia}</td>
                    </tr>
                  ))}
                  {/* Totais */}
                  <tr style={{ background: '#f0fdf4' }}>
                    <td style={{ ...td, fontWeight: 700 }}>TOTAL GERAL</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{data.contagens.reduce((s, b) => s + b.dia_1, 0)}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{data.contagens.reduce((s, b) => s + b.dia_2, 0)}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{data.contagens.reduce((s, b) => s + b.dia_3, 0)}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 800, color: '#059669' }}>{data.contagens.reduce((s, b) => s + b.total, 0)}</td>
                    <td style={td} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Histórico ── */}
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                Histórico de sorteios
                <span style={{ marginLeft: 10, fontSize: '0.85rem', fontWeight: 500, color: '#6b7280' }}>
                  ({historicoFiltrado.length} registro{historicoFiltrado.length !== 1 ? 's' : ''})
                </span>
              </h2>
              <input
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                placeholder="Buscar por brinde, participante ou empresa..."
                style={{
                  border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px',
                  fontSize: '0.9rem', outline: 'none', minWidth: 280, color: '#111827',
                }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Data / Hora</th>
                    <th style={th}>Brinde</th>
                    <th style={th}>Participante</th>
                    <th style={th}>Empresa</th>
                    <th style={{ ...th, textAlign: 'center' }}>Dia</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoFiltrado.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                        {filtro ? 'Nenhum resultado encontrado.' : 'Nenhum sorteio registrado ainda.'}
                      </td>
                    </tr>
                  ) : (
                    historicoFiltrado.map((h, i) => (
                      <tr key={h.id}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                      >
                        <td style={{ ...td, color: '#9ca3af', fontSize: '0.85rem' }}>{i + 1}</td>
                        <td style={{ ...td, whiteSpace: 'nowrap', color: '#374151' }}>{formatDateTime(h.sorteado_em)}</td>
                        <td style={{ ...td }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                            fontSize: '0.82rem', fontWeight: 600,
                            background: '#ecfdf5', color: '#065f46',
                          }}>
                            {h.brinde}
                          </span>
                        </td>
                        <td style={{ ...td, fontWeight: 500 }}>{h.participante}</td>
                        <td style={{ ...td, color: '#6b7280' }}>{h.empresa}</td>
                        <td style={{ ...td, textAlign: 'center', fontWeight: 600 }}>{h.dia_evento}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
