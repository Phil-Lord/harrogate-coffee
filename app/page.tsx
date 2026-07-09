import { client } from '@/sanity/lib/client'
import { COFFEE_SHOPS_QUERY, type CoffeeShop } from '@/sanity/lib/queries'
import { CoffeeShopCard } from '@/app/_components/CoffeeShopCard'

// Statically generated, refreshed at most hourly (ISR).
export const revalidate = 3600

export default async function Home() {
  const shops = await client.fetch<CoffeeShop[]>(COFFEE_SHOPS_QUERY)

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <header className="mb-10 flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Harrogate Coffee Shops
        </h1>
      </header>

      {shops.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
          No coffee shops yet — add some in the{' '}
          <a href="/studio" className="underline">
            Studio
          </a>
          .
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
