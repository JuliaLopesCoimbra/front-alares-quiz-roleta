export type TipoLead = 'isp' | 'empresa'

export interface LeadCreatePayload {
  nome: string
  empresa: string
  whatsapp: string
  estado: string
  cidade: string
  tipo_lead: TipoLead
  segmento_empresa?: string
  porte_isp?: string
}

export interface LeadResponse {
  lead_id: string
  cidade_atendida: boolean
}

export interface GirarResponse {
  brinde: string
  quantidade_restante: number
}

export interface BrindeStatus {
  id: number
  nome: string
  cota_por_dia: number
  sorteados_hoje: number
  restante_hoje: number
}

export interface RoletaStatusResponse {
  dia_evento: number
  brindes: BrindeStatus[]
}

export interface Estado {
  sigla: string
  nome: string
}

export interface Cidade {
  cidade: string
}
