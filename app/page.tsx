import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { StickyNote, Columns3, Sparkles, Cloud } from 'lucide-react'

const features = [
  { icon: StickyNote,  title: 'Notas Ricas',         desc: 'Texto, imagens, listas e código. Editor completo estilo OneNote.' },
  { icon: Columns3,    title: 'Organização em Raias', desc: 'Visualize e mova suas notas entre raias como um quadro Kanban.' },
  { icon: Sparkles,    title: 'Busca Inteligente',    desc: 'Pesquise por contexto, não só palavras-chave. IA gratuita.' },
  { icon: Cloud,       title: 'Seu armazenamento',    desc: 'Notas salvas no seu Google Drive ou OneDrive. Você controla.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-separator)] px-6 h-14 flex items-center justify-between">
        <Logo size="sm" />
        <Link href="/login">
          <Button size="sm">Entrar</Button>
        </Link>
      </header>

      {/* Hero */}
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center gap-6">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-label-primary)] max-w-2xl leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Anotações que se organizam<br />
          <span className="text-[var(--color-blue)]">do jeito que você pensa.</span>
        </h1>

        <p className="text-lg text-[var(--color-label-secondary)] max-w-md leading-relaxed">
          Combine a riqueza do OneNote com a organização visual em raias — e busca semântica com IA.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/login">
            <Button size="lg">Começar gratuitamente</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="secondary">Ver funcionalidades</Button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section
        id="features"
        aria-labelledby="features-title"
        className="max-w-4xl mx-auto w-full px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <h2 id="features-title" className="sr-only">Funcionalidades</h2>
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-[var(--color-bg-primary)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-separator)] flex gap-4"
          >
            <span className="shrink-0 w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-blue)]/10 flex items-center justify-center text-[var(--color-blue)]">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-[var(--color-label-primary)] mb-1">{title}</h3>
              <p className="text-sm text-[var(--color-label-secondary)] leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      <footer className="border-t border-[var(--color-separator)] py-6 text-center text-xs text-[var(--color-label-tertiary)]">
        © {new Date().getFullYear()} Notas Workflow — Feito com ♥
      </footer>
    </div>
  )
}
