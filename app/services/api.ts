import type {
  LeadCreatePayload,
  LeadResponse,
  GirarResponse,
  RoletaStatusResponse,
  Estado,
  Cidade,
} from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw { status: res.status, message: error.detail || 'Erro na requisição' }
  }
  return res.json()
}

export const api = {
  criarLead: (data: LeadCreatePayload) =>
    request<LeadResponse>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  girarRoleta: (leadId: string) =>
    request<GirarResponse>('/api/roleta/girar', {
      method: 'POST',
      body: JSON.stringify({ lead_id: leadId }),
    }),

  statusRoleta: () =>
    request<RoletaStatusResponse>('/api/roleta/status'),

  listarEstados: () =>
    request<Estado[]>('/api/cidades/estados'),

  listarCidades: (estado: string) =>
    request<Cidade[]>(`/api/cidades/${estado}/cidades`),

  verificarCidade: (cidade: string, estado: string) =>
    request<{ cidade_atendida: boolean }>(
      `/api/cidades/verificar?cidade=${encodeURIComponent(cidade)}&estado=${encodeURIComponent(estado)}`
    ),
}
