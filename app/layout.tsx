import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Notas Workflow — Organize e salve suas ideias',
  description: 'Ferramenta de anotações com organização em raias e busca inteligente com IA.',
  icons: { icon: '/logo.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-text)' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
