import Link from 'next/link'

import { cn } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { COFFEE_SHOPS_QUERY } from '@/sanity/lib/queries'
import type { COFFEE_SHOPS_QUERY_RESULT } from '@/sanity.types'
import { EmptyState } from '@/app/_components/EmptyState'
import { ShopBrowser } from '@/app/_components/ShopBrowser'
import { pageContainer } from '@/app/_lib/layout'

// Statically generated, refreshed at most hourly (ISR).
export const revalidate = 3600

export default async function Home() {
  const shops = await client.fetch<COFFEE_SHOPS_QUERY_RESULT>(COFFEE_SHOPS_QUERY)

  return (
    <main className={cn(pageContainer, 'flex-1 py-12')}>
      {shops.length === 0 ? (
        <EmptyState>
          No coffee shops yet — add some in the{' '}
          <Link href="/studio" className="underline">
            Studio
          </Link>
          .
        </EmptyState>
      ) : (
        <ShopBrowser shops={shops} />
      )}
    </main>
  )
}
