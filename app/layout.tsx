import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from './context/AppContext'
import { KeyboardProvider } from './context/KeyboardContext'
import { ScreensaverOverlay } from './components/ScreensaverOverlay'

export const metadata: Metadata = {
  title: 'Alares Roleta Quiz',
  description: 'Roleta de brindes Alares',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="w-screen h-screen overflow-hidden">
        <AppProvider>
          <KeyboardProvider>
            <ScreensaverOverlay />
            {children}
          </KeyboardProvider>
        </AppProvider>
      </body>
    </html>
  )
}
