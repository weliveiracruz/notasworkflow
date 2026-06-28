import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-primary)] rounded-[var(--radius-lg)]',
        'shadow-[var(--shadow-sm)] border border-[var(--color-separator)]',
        padding === 'none' && 'p-0',
        padding === 'sm'  && 'p-3',
        padding === 'md'  && 'p-4',
        padding === 'lg'  && 'p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
