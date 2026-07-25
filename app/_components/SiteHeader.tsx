'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee } from 'lucide-react'

import { cn } from '@/lib/utils'
import { FixedBar } from '@/app/_components/FixedBar'
import { pageContainer } from '@/app/_lib/layout'

export function SiteHeader() {
  // The landing page has no other top-level heading, so the site title carries
  // its <h1>. Elsewhere the page's own heading owns that, and this is a link.
  const Title = usePathname() === '/' ? 'h1' : 'span'

  return (
    <FixedBar as="header" height="h-[var(--header-h)]" className="top-0 z-50">
      <div className={cn(pageContainer, 'flex h-full items-center')}>
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Coffee className="size-5 shrink-0 text-primary sm:size-6" aria-hidden />
          <Title className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Harrogate Coffee Shops
          </Title>
        </Link>
      </div>
    </FixedBar>
  )
}
