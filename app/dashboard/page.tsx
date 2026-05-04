'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quiz-roulette.picbrand.com.br'

const DIAS = [
  { num: 1, label: '03/05' },
  { num: 2, label: '04/05' },
  { num: 3, label: '05/05' },
]

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

const POR_PAGINA = 20

function DayTabs({ active, onChange, counts }: { active: number; onChange: (d: number) => void; counts?: number[] }) {
  return (
    <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb' }}>
      {DIAS.map((dia, i) => {
        const isActive = active === dia.num
        return (
          <button
            key={dia.num}
            onClick={() => onChange(dia.num)}
            style={{
              padding: '14px 28px',
              fontSize: '0.95rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#059669' : '#6b7280',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid #059669' : '2px solid transparent',
              marginBottom: -2,
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {dia.label}
            {counts !== undefined && (
              <span style={{ marginLeft: 8, fontSize: '0.8rem', fontWeight: 500, color: isActive ? '#059669' : '#9ca3af' }}>
                ({counts[i]})
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtro, setFiltro] = useState('')
  const [tabResumo, setTabResumo] = useState(1)
  const [tabHistorico, setTabHistorico] = useState(1)
  const [pagina, setPagina] = useState(1)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)
    setErro(null)
    try {
      const res = await fetch(`${API_URL}/api/dashboard`)
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      setData(await res.json())
      setUltimaAtualizacao(new Date())
    } catch (e: unknown) {
      setErro((e as Error).message || 'Erro ao carregar dashboard')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(true), 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { setPagina(1) }, [filtro, tabHistorico])

  // Contagens do dia selecionado no resumo
  const diaKey = `dia_${tabResumo}` as 'dia_1' | 'dia_2' | 'dia_3'

  // Histórico filtrado por dia + busca
  const historicoDia = data?.historico.filter(h => h.dia_evento === tabHistorico) ?? []
  const historicoFiltrado = historicoDia.filter(h =>
    !filtro ||
    h.brinde.toLowerCase().includes(filtro.toLowerCase()) ||
    h.participante.toLowerCase().includes(filtro.toLowerCase()) ||
    h.empresa.toLowerCase().includes(filtro.toLowerCase())
  )

  const totalPaginas = Math.max(1, Math.ceil(historicoFiltrado.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const historicoPagina = historicoFiltrado.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  const historicoCounts = DIAS.map(d => data?.historico.filter(h => h.dia_evento === d.num).length ?? 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 32px', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.95rem' }}>Alares Roleta Quiz — controle de sorteios</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/cities"
            style={{
              background: 'white', color: '#374151', border: '1px solid #e5e7eb',
              borderRadius: 10, padding: '10px 20px', fontWeight: 600,
              fontSize: '0.9rem', textDecoration: 'none',
            }}
          >
            🗺 Cidades Atendidas
          </Link>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f6a5', display: 'inline-block', boxShadow: '0 0 6px #00f6a5' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#059669' }}>Ao vivo</span>
          </div>
          {ultimaAtualizacao && (
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '4px 0 0' }}>
              Atualizado às {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>
        </div>
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

            <DayTabs active={tabResumo} onChange={setTabResumo} />

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Brinde</th>
                    <th style={{ ...th, textAlign: 'center' }}>Sorteados</th>
                    <th style={{ ...th, textAlign: 'center' }}>Cota/dia</th>
                    <th style={{ ...th, textAlign: 'center' }}>Restante</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contagens.map(b => {
                    const sorteados = b[diaKey]
                    const restante = b.cota_por_dia - sorteados
                    return (
                      <tr key={b.nome}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                      >
                        <td style={{ ...td, fontWeight: 600 }}>{b.nome}</td>
                        <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: '#059669' }}>{sorteados}</td>
                        <td style={{ ...td, textAlign: 'center', color: '#6b7280' }}>{b.cota_por_dia}</td>
                        <td style={{ ...td, textAlign: 'center', color: restante < 0 ? '#dc2626' : restante === 0 ? '#9ca3af' : '#374151' }}>
                          {restante}
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: '#f0fdf4' }}>
                    <td style={{ ...td, fontWeight: 700 }}>TOTAL</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 800, color: '#059669' }}>
                      {data.contagens.reduce((s, b) => s + b[diaKey], 0)}
                    </td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>
                      {data.contagens.reduce((s, b) => s + b.cota_por_dia, 0)}
                    </td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>
                      {data.contagens.reduce((s, b) => s + (b.cota_por_dia - b[diaKey]), 0)}
                    </td>
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

            <DayTabs active={tabHistorico} onChange={setTabHistorico} counts={historicoCounts} />

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Data / Hora</th>
                    <th style={th}>Brinde</th>
                    <th style={th}>Participante</th>
                    <th style={th}>Empresa</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoFiltrado.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                        {filtro ? 'Nenhum resultado encontrado.' : `Nenhum sorteio registrado em ${DIAS[tabHistorico - 1].label}.`}
                      </td>
                    </tr>
                  ) : (
                    historicoPagina.map((h, i) => (
                      <tr key={h.id}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                      >
                        <td style={{ ...td, color: '#9ca3af', fontSize: '0.85rem' }}>{(paginaAtual - 1) * POR_PAGINA + i + 1}</td>
                        <td style={{ ...td, whiteSpace: 'nowrap', color: '#374151' }}>{formatDateTime(h.sorteado_em)}</td>
                        <td style={td}>
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Página {paginaAtual} de {totalPaginas} — {historicoFiltrado.length} registros
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { label: '«', action: () => setPagina(1), disabled: paginaAtual === 1 },
                    { label: '‹ Anterior', action: () => setPagina(p => Math.max(1, p - 1)), disabled: paginaAtual === 1 },
                    { label: 'Próxima ›', action: () => setPagina(p => Math.min(totalPaginas, p + 1)), disabled: paginaAtual === totalPaginas },
                    { label: '»', action: () => setPagina(totalPaginas), disabled: paginaAtual === totalPaginas },
                  ].map(btn => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      disabled={btn.disabled}
                      style={{
                        padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600,
                        border: '1px solid #e5e7eb', borderRadius: 8,
                        background: 'white', color: btn.disabled ? '#d1d5db' : '#374151',
                        cursor: btn.disabled ? 'default' : 'pointer',
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
