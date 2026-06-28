import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leadingIcon, trailingIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-label-primary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 text-[var(--color-label-secondary)]" aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-separator-opaque)]',
              'bg-[var(--color-bg-primary)] text-[var(--color-label-primary)] text-sm',
              'px-3 transition-colors placeholder:text-[var(--color-label-tertiary)]',
              'focus:outline-none focus:border-[var(--color-blue)] focus:ring-2 focus:ring-[var(--color-blue)]/20',
              error && 'border-[var(--color-red)] focus:border-[var(--color-red)] focus:ring-[var(--color-red)]/20',
              leadingIcon && 'pl-9',
              trailingIcon && 'pr-9',
              className,
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="absolute right-3 text-[var(--color-label-secondary)]" aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--color-red)]">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
