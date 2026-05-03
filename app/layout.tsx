import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AppProvider } from './context/AppContext'
import { KeyboardProvider } from './context/KeyboardContext'
import { ScreensaverOverlay } from './components/ScreensaverOverlay'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Alares Roleta Quiz',
  description: 'Roleta de brindes Alares',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
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
