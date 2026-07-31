import Link from 'next/link'

import { cn } from '@/lib/utils'
import { studioUrl } from '@/sanity/env'
import { sanityFetch } from '@/sanity/lib/live'
import { COFFEE_SHOPS_QUERY } from '@/sanity/lib/queries'
import type { COFFEE_SHOPS_QUERY_RESULT } from '@/sanity.types'
import { EmptyState } from '@/app/_components/EmptyState'
import { ShopBrowser } from '@/app/_components/ShopBrowser'
import { pageContainer } from '@/app/_lib/layout'

export default async function Home() {
  const shops = await sanityFetch<COFFEE_SHOPS_QUERY_RESULT>({
    query: COFFEE_SHOPS_QUERY,
  })

  return (
    <main className={cn(pageContainer, 'flex-1 py-12')}>
      {shops.length === 0 ? (
        <EmptyState>
          No coffee shops yet — add some in the{' '}
          <Link href={studioUrl} className="underline">
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
