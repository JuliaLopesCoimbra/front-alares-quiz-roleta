# Alares Roleta Quiz — Front-end

Interface Next.js 14 para o sistema de roleta de brindes do evento Alares.  
Projetada para totem (1080×1920px), totalmente responsiva.

## Requisitos

- Node 18+

## Configuração do ambiente

```bash
cp .env.local.example .env.local
# Edite NEXT_PUBLIC_API_URL com a URL do back-end
```

## Instalação

```bash
npm install
```

## Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Estrutura de pastas

```
front/
├── app/
│   ├── components/        # componentes reutilizáveis (ScreenBackground, Screensaver, FadeWrapper)
│   ├── context/           # AppContext — estado global da sessão
│   ├── hooks/             # useIdleTimer — detecção de inatividade (screensaver)
│   ├── lib/               # utilitários de transição/animação
│   ├── pages/             # telas da aplicação (Tela1 a Tela7)
│   ├── services/          # cliente HTTP para a API (api.ts)
│   ├── types/             # tipos TypeScript compartilhados
│   ├── utils/             # listas estáticas (estados brasileiros)
│   ├── globals.css        # reset + Tailwind + keyframes
│   ├── layout.tsx         # layout raiz com AppProvider e ScreensaverOverlay
│   └── page.tsx           # roteador de telas baseado em telaAtual
└── public/
    ├── backgrounds/       # fundos das telas: tela1–7.png, descanso.png
    ├── roulette/          # assets visuais da roleta (a implementar)
    └── prizes/            # imagens dos prêmios (a implementar)
```

## Fluxo de telas

```
Tela 1 (clique) → Tela 2 (SIM/NÃO) → Tela 3 (formulário) → Tela 4 (roleta)
→ Tela 5 (brinde) → Tela 6 (cidade atendida) ou Tela 7 (agradecimento)
→ volta para Tela 1 após 10s ou clique
```

Screensaver: aparece após 30s de inatividade em qualquer tela. Qualquer clique remove.

## Assets necessários

Adicionar em `public/backgrounds/`:
- `tela1.png`, `tela2.png`, `tela3.png`, `tela4.png`, `tela5.png`, `tela6.png`, `tela7.png`
- `descanso.png`
