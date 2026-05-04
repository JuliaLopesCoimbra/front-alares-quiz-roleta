'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quiz-roulette.picbrand.com.br'

interface PessoaNaoAtendida {
  nome: string
  empresa: string
  whatsapp: string
  cidade: string
  estado: string
  tipo_lead: string
  criado_em: string | null
}

const POR_PAGINA = 20

function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  const utc = iso.endsWith('Z') || iso.includes('+') ? iso : iso + 'Z'
  return new Date(utc).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

const th: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: '#6b7280',
  borderBottom: '2px solid #e5e7eb',
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '0.88rem',
  borderBottom: '1px solid #f3f4f6',
  color: '#111827',
}

export default function PessoasNaoAtendidas() {
  const [data, setData] = useState<PessoaNaoAtendida[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/dashboard/pessoas-nao-atendidas`)
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
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(true), 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { setPagina(1) }, [busca])

  const filtrado = data.filter(p =>
    !busca ||
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.empresa.toLowerCase().includes(busca.toLowerCase()) ||
    p.cidade.toLowerCase().includes(busca.toLowerCase())
  )

  const totalPaginas = Math.max(1, Math.ceil(filtrado.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const paginados = filtrado.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  const pad = isMobile ? '16px' : '40px 32px'

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: pad, fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 20, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>Pessoas Não Atendidas</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.88rem' }}>Leads de cidades fora da cobertura Alares</p>
          {!loading && (
            <p style={{ color: '#dc2626', margin: '6px 0 0', fontSize: '0.85rem', fontWeight: 600 }}>
              {data.length} pessoa{data.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f6a5', display: 'inline-block', boxShadow: '0 0 6px #00f6a5' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>Ao vivo</span>
            {ultimaAtualizacao && !isMobile && (
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{ultimaAtualizacao.toLocaleTimeString('pt-BR')}</span>
            )}
          </div>
          <Link href="/pessoas-atendidas" style={{ background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Atendidas
          </Link>
        </div>
      </div>

      {/* Filtro */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome, empresa ou cidade..."
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.9rem', outline: 'none', width: '100%', color: '#111827', background: 'white' }}
        />
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Carregando...</p>}
      {erro && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '12px 16px', borderRadius: 8 }}>{erro}</p>}

      {!loading && (
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>#</th>
                  <th style={th}>Nome</th>
                  {!isMobile && <th style={th}>Empresa</th>}
                  <th style={th}>Cidade</th>
                  <th style={{ ...th, textAlign: 'center' }}>UF</th>
                  {!isMobile && <th style={th}>Cadastro</th>}
                </tr>
              </thead>
              <tbody>
                {filtrado.length === 0 ? (
                  <tr>
                    <td colSpan={isMobile ? 4 : 6} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                      Nenhuma pessoa encontrada.
                    </td>
                  </tr>
                ) : (
                  paginados.map((p, i) => (
                    <tr key={p.whatsapp}>
                      <td style={{ ...td, color: '#9ca3af', fontSize: '0.78rem' }}>{(paginaAtual - 1) * POR_PAGINA + i + 1}</td>
                      <td style={{ ...td, fontWeight: 600 }}>{p.nome}</td>
                      {!isMobile && <td style={{ ...td, color: '#6b7280' }}>{p.empresa}</td>}
                      <td style={{ ...td, fontSize: '0.82rem' }}>{p.cidade}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 700, fontSize: '0.82rem' }}>{p.estado}</td>
                      {!isMobile && <td style={{ ...td, fontSize: '0.82rem', color: '#6b7280' }}>{formatDateTime(p.criado_em)}</td>}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #f3f4f6', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Pág. {paginaAtual}/{totalPaginas} — {filtrado.length} registros</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={paginaAtual === 1} style={{ padding: '6px 12px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', color: paginaAtual === 1 ? '#d1d5db' : '#374151', cursor: paginaAtual === 1 ? 'default' : 'pointer' }}>‹</button>
                <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas} style={{ padding: '6px 12px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', color: paginaAtual === totalPaginas ? '#d1d5db' : '#374151', cursor: paginaAtual === totalPaginas ? 'default' : 'pointer' }}>›</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
