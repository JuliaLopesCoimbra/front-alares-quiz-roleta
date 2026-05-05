'use client'

import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useKeyboard } from '../context/KeyboardContext'
import { ScreenBackground } from '../components/ScreenBackground'
import { api } from '../services/api'
import type { Cidade } from '../types'
import { ESTADOS } from '../utils/estados'
import { SelectField } from '../components/SelectField'
import { AutocompleteField } from '../components/AutocompleteField'
import { VirtualKeyboard } from '../components/VirtualKeyboard'

function maskWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, '($1')
  if (digits.length <= 7) return digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2')
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

const PORTES_ISP = [
  'Até 5 mil assinantes',
  'De 5 mil a 10 mil assinantes',
  'De 10 mil a 50 mil assinantes',
  'Mais de 50 mil assinantes',
]

const fieldStyle: React.CSSProperties = {
  borderRadius: '16px',
  height: 'clamp(56px, 5vh, 90px)',
  padding: '0 20px',
  fontSize: 'clamp(1.1rem, 2.2vh, 1.8rem)',
  border: 'none',
  outline: 'none',
  width: '100%',
  background: 'white',
  color: 'black',
}

export function Tela3() {
  const { tipoLead, setLeadId, setCidadeAtendida, setTelaAtual } = useApp()
  const { openKeyboard } = useKeyboard()

  const [isTotem, setIsTotem] = useState(false)
  useEffect(() => {
    const check = () => setIsTotem(window.innerWidth >= 1080)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const nomeRef = useRef<HTMLInputElement>(null)
  const empresaRef = useRef<HTMLInputElement>(null)
  const whatsappRef = useRef<HTMLInputElement>(null)
  const segmentoRef = useRef<HTMLInputElement>(null)

  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [porteIsp, setPorteIsp] = useState('')
  const [segmento, setSegmento] = useState('')
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [formReady, setFormReady] = useState(false)

  useEffect(() => {
    setCidade('')
    if (estado && estado !== 'EX') {
      api.listarCidades(estado).then(setCidades).catch(() => setCidades([]))
    } else {
      setCidades([])
    }
  }, [estado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    try {
      const payload = {
        nome,
        empresa,
        whatsapp,
        estado,
        cidade: estado === 'EX' ? 'Fora do Brasil' : cidade,
        tipo_lead: tipoLead!,
        ...(tipoLead === 'isp' ? { porte_isp: porteIsp } : { segmento_empresa: segmento }),
      }
      const res = await api.criarLead(payload)
      setLeadId(res.lead_id)
      setCidadeAtendida(res.cidade_atendida)
      setTelaAtual(4)
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string }
      if (e.status === 409 || e.message === 'WhatsApp já cadastrado') {
        setErro('Este número de WhatsApp já está cadastrado. Cada participante pode se inscrever apenas uma vez.')
      } else {
        setErro(e.message || 'Erro ao enviar formulário')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    {isTotem && <VirtualKeyboard bottomOffset={300} />}
    {isTotem && (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '48px',
        pointerEvents: 'none',
      }}>
        <img src="/alares.png" alt="Alares" style={{ height: '230px', objectFit: 'contain' }} />
      </div>
    )}
    <ScreenBackground src="/backgrounds/tela3.png">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="absolute inset-0 flex flex-col items-center pb-8 totem:pb-12"
        style={{ paddingTop: isTotem ? '6vh' : '26vh', paddingBottom: isTotem ? '700px' : '0' }}
      >
        {/* Wrapper centralizado com largura máxima */}
        <div className="w-full flex flex-col flex-1 overflow-hidden px-6" style={{ maxWidth: '860px' }}>
        {/* Área rolável */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 totem:gap-5 pb-4">

          <p className="text-white font-normal leading-snug mb-1 text-[1.2rem] totem:text-[clamp(2rem,5vh,3.3rem)]">
            Agora, preencha o formulário:
          </p>

          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-white font-bold" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.5rem)' }}>Nome</label>
            <input
              ref={nomeRef}
              required
              value={nome}
              onChange={e => setNome(e.target.value)}
              onFocus={() => { setFormReady(true); nomeRef.current && openKeyboard(nomeRef.current, 'text') }}
              readOnly={!formReady}
              inputMode={isTotem ? 'none' : 'text'}
              autoComplete="off"
              data-form-type="other"
              data-lpignore="true"
              style={fieldStyle}
            />
          </div>

          {/* Empresa */}
          <div className="flex flex-col gap-1">
            <label className="text-white font-bold" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.5rem)' }}>Empresa</label>
            <input
              ref={empresaRef}
              required
              value={empresa}
              onChange={e => setEmpresa(e.target.value)}
              onFocus={() => { setFormReady(true); empresaRef.current && openKeyboard(empresaRef.current, 'text') }}
              readOnly={!formReady}
              inputMode={isTotem ? 'none' : 'text'}
              autoComplete="off"
              data-form-type="other"
              data-lpignore="true"
              style={fieldStyle}
            />
          </div>

          {/* WhatsApp | Estado | Cidade */}
          <div className="flex gap-3 items-end">
            {/* WhatsApp ~40% */}
            <div className="flex flex-col gap-1" style={{ flex: 2 }}>
              <label className="text-white font-bold" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.5rem)' }}>WhatsApp</label>
              <input
                ref={whatsappRef}
                required
                value={whatsapp}
                onChange={e => setWhatsapp(maskWhatsapp(e.target.value))}
                onFocus={() => { setFormReady(true); whatsappRef.current && openKeyboard(whatsappRef.current, 'numeric') }}
                readOnly={!formReady}
                placeholder="(00) 00000-0000"
                inputMode={isTotem ? 'none' : 'numeric'}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                style={fieldStyle}
              />
            </div>

            {/* Estado */}
            <div className="flex flex-col gap-1" style={{ flex: '0 0 clamp(80px, 10vw, 140px)' }}>
              <label className="text-white font-bold" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.5rem)' }}>Estado</label>
              <SelectField
                required
                value={estado}
                onChange={v => setEstado(v)}
                options={ESTADOS.map(s => ({ value: s.sigla, label: s.sigla }))}
              />
            </div>

            {/* Cidade */}
            <div className="flex flex-col gap-1" style={{ flex: 1.5 }}>
              <label className="text-white font-bold" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.5rem)' }}>Cidade</label>
              {estado === 'EX' ? (
                <input
                  value="Fora do Brasil"
                  readOnly
                  style={{ ...fieldStyle }}
                />
              ) : (
                <AutocompleteField
                  required
                  value={cidade}
                  onChange={v => setCidade(v)}
                  options={cidades.map(c => c.cidade)}
                  disabled={!estado}
                  onInputFocus={isTotem ? el => openKeyboard(el, 'text') : undefined}
                  inputMode={isTotem ? 'none' : 'text'}
                />
              )}
            </div>
          </div>

          {/* Porte ISP */}
          {tipoLead === 'isp' ? (
            <div className="flex flex-col gap-2">
              <label className="text-white font-bold" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.5rem)' }}>Porte do ISP</label>
              <div className="grid grid-cols-2 gap-3">
                {PORTES_ISP.map(porte => {
                  const selected = porteIsp === porte
                  return (
                    <button
                      key={porte}
                      type="button"
                      onClick={() => setPorteIsp(porte)}
                      className="font-medium rounded-2xl transition-colors active:scale-95"
                      style={{
                        background: 'transparent',
                        border: `2px solid ${selected ? '#00f6a5' : 'white'}`,
                        color: selected ? '#00f6a5' : 'white',
                        padding: 'clamp(12px, 1.5vh, 24px) 8px',
                        fontSize: 'clamp(1rem, 2vh, 1.8rem)',
                      }}
                    >
                      {porte}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Segmento da Empresa */
            <div className="flex flex-col gap-1">
              <label className="text-white font-bold" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.5rem)' }}>Segmento da Empresa</label>
              <input
                ref={segmentoRef}
                required
                value={segmento}
                onChange={e => setSegmento(e.target.value)}
                onFocus={() => { setFormReady(true); segmentoRef.current && openKeyboard(segmentoRef.current, 'text') }}
                readOnly={!formReady}
                inputMode={isTotem ? 'none' : 'text'}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                style={fieldStyle}
              />
            </div>
          )}

          {erro && (
            <p className="text-red-400 text-sm bg-black/40 rounded-lg px-4 py-2">{erro}</p>
          )}

          {/* Botão enviar */}
          {(() => {
            const allFilled = Boolean(
              nome.trim() &&
              empresa.trim() &&
              whatsapp &&
              estado &&
              (estado === 'EX' || cidade) &&
              (tipoLead === 'isp' ? porteIsp : segmento.trim())
            )
            return (
              <button
                type="submit"
                disabled={loading || !allFilled}
                className="w-full font-bold uppercase tracking-wider disabled:opacity-50 active:scale-95 transition-transform mt-2"
                style={{
                  background: '#00f6a5',
                  color: allFilled ? '#042d1e' : '#108277',
                  border: 'none',
                  borderRadius: '16px',
                  height: 'clamp(70px, 9vh, 120px)',
                  minHeight: 'clamp(70px, 9vh, 120px)',
                  flexShrink: 0,
                  fontSize: 'clamp(1.2rem, 2.8vh, 2.5rem)',
                  letterSpacing: '0.06em',
                  transition: 'color 0.2s',
                }}
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR RESPOSTA'}
              </button>
            )
          })()}

        </div>
        </div>
      </form>
    </ScreenBackground>
    </>
  )
}
