'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quiz-roulette.picbrand.com.br'

interface PessoaAtendida {
  nome: string
  empresa: string
  whatsapp: string
  cidade: string
  estado: string
  tipo_lead: string
  criado_em: string | null
  brinde: string | null
  dia_evento: number | null
  sorteado_em: string | null
}

const DIAS: Record<number, string> = { 1: '03/05', 2: '04/05', 3: '05/05' }

const POR_PAGINA = 20

function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
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
  fontSize: '0.9rem',
  borderBottom: '1px solid #f3f4f6',
  color: '#111827',
}

export default function PessoasAtendidas() {
  const [data, setData] = useState<PessoaAtendida[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [filtroDia, setFiltroDia] = useState<number | null>(null)
  const [pagina, setPagina] = useState(1)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/dashboard/pessoas-atendidas`)
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      setData(await res.json())
      setUltimaAtualizacao(new Date())
    } catch (e: unknown) {
      setErro((e as Error).message)
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
    const interval = setInterval(() => fetchData(true), 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { setPagina(1) }, [busca, filtroDia])

  const filtrado = data.filter(p => {
    const matchBusca = !busca ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.empresa.toLowerCase().includes(busca.toLowerCase()) ||
      p.cidade.toLowerCase().includes(busca.toLowerCase()) ||
      (p.brinde ?? '').toLowerCase().includes(busca.toLowerCase())
    const matchDia = filtroDia === null || p.dia_evento === filtroDia
    return matchBusca && matchDia
  })

  const totalPaginas = Math.max(1, Math.ceil(filtrado.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const paginados = filtrado.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  const countPorDia = (dia: number) => data.filter(p => p.dia_evento === dia).length

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 32px', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            Pessoas Atendidas
          </h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.95rem' }}>
            Leads cadastrados de cidades com cobertura Alares
          </p>
          {!loading && (
            <p style={{ color: '#059669', margin: '8px 0 0', fontSize: '0.9rem', fontWeight: 600 }}>
              {data.length} pessoa{data.length !== 1 ? 's' : ''} atendida{data.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f6a5', display: 'inline-block', boxShadow: '0 0 6px #00f6a5' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#059669' }}>Ao vivo</span>
            </div>
            {ultimaAtualizacao && (
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '4px 0 0' }}>
                {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
              </p>
            )}
          </div>
          <Link
            href="/cities"
            style={{
              background: 'white', color: '#374151', border: '1px solid #e5e7eb',
              borderRadius: 10, padding: '10px 20px', fontWeight: 600,
              fontSize: '0.9rem', textDecoration: 'none',
            }}
          >
            ← Cidades
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome, empresa, cidade ou brinde..."
          style={{
            border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 16px',
            fontSize: '0.9rem', outline: 'none', minWidth: 320, color: '#111827', background: 'white',
          }}
        />
        {/* Filtro por dia */}
        {([null, 1, 2, 3] as (number | null)[]).map(dia => (
          <button
            key={String(dia)}
            onClick={() => setFiltroDia(dia)}
            style={{
              padding: '10px 18px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
              border: '1px solid #e5e7eb', cursor: 'pointer',
              background: filtroDia === dia ? '#059669' : 'white',
              color: filtroDia === dia ? 'white' : '#374151',
            }}
          >
            {dia === null ? `Todos (${data.length})` : `${DIAS[dia]} (${countPorDia(dia)})`}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Carregando...</p>}
      {erro && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '12px 16px', borderRadius: 8 }}>{erro}</p>}

      {/* Tabela */}
      {!loading && (
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>#</th>
                  <th style={th}>Nome</th>
                  <th style={th}>Empresa</th>
                  <th style={th}>WhatsApp</th>
                  <th style={th}>Cidade</th>
                  <th style={{ ...th, textAlign: 'center' }}>UF</th>
                  <th style={th}>Brinde</th>
                  <th style={{ ...th, textAlign: 'center' }}>Dia</th>
                  <th style={th}>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filtrado.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                      Nenhuma pessoa encontrada.
                    </td>
                  </tr>
                ) : (
                  paginados.map((p, i) => (
                    <tr key={p.whatsapp}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                    >
                      <td style={{ ...td, color: '#9ca3af', fontSize: '0.8rem' }}>{(paginaAtual - 1) * POR_PAGINA + i + 1}</td>
                      <td style={{ ...td, fontWeight: 600 }}>{p.nome}</td>
                      <td style={{ ...td, color: '#6b7280' }}>{p.empresa}</td>
                      <td style={{ ...td, color: '#6b7280', whiteSpace: 'nowrap' }}>{p.whatsapp}</td>
                      <td style={td}>{p.cidade}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{p.estado}</td>
                      <td style={td}>
                        {p.brinde ? (
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                            fontSize: '0.8rem', fontWeight: 600,
                            background: '#ecfdf5', color: '#065f46',
                          }}>
                            {p.brinde}
                          </span>
                        ) : (
                          <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>—</span>
                        )}
                      </td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        {p.dia_evento ? (
                          <span style={{
                            display: 'inline-block', padding: '2px 10px', borderRadius: 20,
                            fontSize: '0.8rem', fontWeight: 600,
                            background: '#eff6ff', color: '#1d4ed8',
                          }}>
                            {DIAS[p.dia_evento] ?? p.dia_evento}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ ...td, whiteSpace: 'nowrap', color: '#374151' }}>{formatDateTime(p.criado_em)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Página {paginaAtual} de {totalPaginas} — {filtrado.length} registros
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: '«', action: () => setPagina(1), disabled: paginaAtual === 1 },
                  { label: '‹ Anterior', action: () => setPagina(p => Math.max(1, p - 1)), disabled: paginaAtual === 1 },
                  { label: 'Próxima ›', action: () => setPagina(p => Math.min(totalPaginas, p + 1)), disabled: paginaAtual === totalPaginas },
                  { label: '»', action: () => setPagina(totalPaginas), disabled: paginaAtual === totalPaginas },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} disabled={btn.disabled}
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
      )}
    </div>
  )
}
