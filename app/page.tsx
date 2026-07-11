import Link from 'next/link'

import { client } from '@/sanity/lib/client'
import { COFFEE_SHOPS_QUERY } from '@/sanity/lib/queries'
import type { COFFEE_SHOPS_QUERY_RESULT } from '@/sanity.types'
import { CoffeeShopCard } from '@/app/_components/CoffeeShopCard'

// Statically generated, refreshed at most hourly (ISR).
export const revalidate = 3600

export default async function Home() {
  const shops = await client.fetch<COFFEE_SHOPS_QUERY_RESULT>(COFFEE_SHOPS_QUERY)

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Harrogate Coffee Shops
        </h1>
      </header>

      {shops.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No coffee shops yet — add some in the{' '}
          <Link href="/studio" className="underline">
            Studio
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {shops.map((shop) => (
            <li key={shop._id}>
              <CoffeeShopCard shop={shop} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
