'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee } from 'lucide-react'

export function SiteHeader() {
  // The landing page has no other top-level heading, so the site title carries
  // its <h1>. Elsewhere the page's own heading owns that, and this is a link.
  const Title = usePathname() === '/' ? 'h1' : 'span'

  return (
    <>
      {/* Fixed, not sticky: a sticky header rides the elastic overscroll bounce. */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-muted sm:h-16">
        <div className="mx-auto flex h-full w-full max-w-3xl items-center px-6">
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
      </header>
      {/* Reserves the space the fixed header no longer takes up in the flow. */}
      <div aria-hidden className="h-14 shrink-0 sm:h-16" />
    </>
  )
}
