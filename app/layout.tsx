import type { Metadata } from 'next'
import './globals.css'
import { ConfigProvider } from './context/ConfigContext'

export const metadata: Metadata = {
  title: 'Simulador prestamos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
