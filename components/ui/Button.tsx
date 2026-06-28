import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all select-none',
          'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-blue)] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          /* Tamanho mínimo de alvo WCAG 2.5.8 */
          size === 'sm' && 'h-8 px-3 text-sm rounded-[var(--radius-md)]',
          size === 'md' && 'h-10 px-4 text-sm rounded-[var(--radius-md)]',
          size === 'lg' && 'h-12 px-6 text-base rounded-[var(--radius-lg)]',
          variant === 'primary' && 'bg-[var(--color-blue)] text-white hover:opacity-90 active:scale-[.98]',
          variant === 'secondary' && 'bg-[var(--color-bg-secondary)] text-[var(--color-label-primary)] border border-[var(--color-separator-opaque)] hover:bg-[var(--color-bg-tertiary)]',
          variant === 'ghost' && 'bg-transparent text-[var(--color-blue)] hover:bg-[var(--color-bg-secondary)]',
          variant === 'danger' && 'bg-[var(--color-red)] text-white hover:opacity-90',
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
