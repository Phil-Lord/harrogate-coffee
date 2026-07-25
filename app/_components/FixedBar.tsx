import { cn } from '@/lib/utils'

// Fixed, not sticky: a sticky bar rides the elastic overscroll bounce. Frosted
// only where `backdrop-filter` is supported, so the fallback stays opaque.
// `height` also sizes the spacer, so the two can't drift apart.
export function FixedBar({
  as: Element = 'div',
  height,
  className,
  children,
}: {
  as?: 'div' | 'header' | 'nav'
  height: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <>
      <Element
        className={cn(
          'fixed inset-x-0 border-b border-border bg-muted backdrop-blur-xl supports-[backdrop-filter]:bg-muted/65',
          height,
          className,
        )}
      >
        {children}
      </Element>
      <div aria-hidden className={cn('shrink-0', height)} />
    </>
  )
}
