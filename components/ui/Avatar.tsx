import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 28, md: 36, lg: 48 }
const textSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const px = sizeMap[size]
  const initials = name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden font-semibold',
        'bg-[var(--color-blue)] text-white select-none shrink-0',
        textSize[size],
        className,
      )}
      style={{ width: px, height: px }}
      aria-label={name ?? 'Usuário'}
    >
      {src ? (
        <Image src={src} alt={name ?? 'Usuário'} width={px} height={px} className="object-cover" />
      ) : (
        initials
      )}
    </span>
  )
}
