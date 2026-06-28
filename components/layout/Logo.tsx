import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.4 : 1

  return (
    <span className={cn('inline-flex items-center gap-2 select-none', className)} aria-label="Notas Workflow">
      {/* Ícone lápis */}
      <svg
        width={Math.round(28 * scale)}
        height={Math.round(28 * scale)}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Corpo do lápis */}
        <rect x="10" y="2" width="8" height="18" rx="2" fill="#007AFF" transform="rotate(0 14 14)" />
        {/* Borracha */}
        <rect x="10" y="1" width="8" height="4" rx="1.5" fill="#FF9500" />
        {/* Anel metálico */}
        <rect x="10" y="5" width="8" height="2" fill="#C6C6C8" />
        {/* Ponta madeira */}
        <polygon points="10,20 18,20 14,26" fill="#E8C97A" />
        {/* Grafite */}
        <polygon points="12.5,24.5 15.5,24.5 14,27" fill="#3A3A3C" />
        {/* Brilho */}
        <rect x="12" y="7" width="2" height="12" rx="1" fill="white" opacity="0.2" />
      </svg>

      {/* Wordmark */}
      <span
        style={{ fontFamily: 'var(--font-display)', fontSize: Math.round(16 * scale) }}
        className="leading-none font-bold tracking-tight"
      >
        <span className="text-[var(--color-label-primary)]">Notas</span>
        <span className="text-[var(--color-blue)]"> Workflow</span>
      </span>
    </span>
  )
}
