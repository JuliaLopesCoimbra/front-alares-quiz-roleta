'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { TipoLead } from '../types'

interface AppContextType {
  tipoLead: TipoLead | null
  leadId: string | null
  cidadeAtendida: boolean | null
  brindeGanho: string | null
  telaAtual: number
  setTipoLead: (tipo: TipoLead) => void
  setLeadId: (id: string) => void
  setCidadeAtendida: (atendida: boolean) => void
  setBrindeGanho: (brinde: string) => void
  setTelaAtual: (tela: number) => void
  resetContexto: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tipoLead, setTipoLead] = useState<TipoLead | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [cidadeAtendida, setCidadeAtendida] = useState<boolean | null>(null)
  const [brindeGanho, setBrindeGanho] = useState<string | null>(null)
  const [telaAtual, setTelaAtual] = useState<number>(1)

  const resetContexto = () => {
    setTipoLead(null)
    setLeadId(null)
    setCidadeAtendida(null)
    setBrindeGanho(null)
    setTelaAtual(1)
  }

  return (
    <AppContext.Provider
      value={{
        tipoLead,
        leadId,
        cidadeAtendida,
        brindeGanho,
        telaAtual,
        setTipoLead,
        setLeadId,
        setCidadeAtendida,
        setBrindeGanho,
        setTelaAtual,
        resetContexto,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
