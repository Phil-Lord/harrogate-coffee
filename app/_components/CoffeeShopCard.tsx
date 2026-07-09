import Image from 'next/image'
import Link from 'next/link'

import { urlFor } from '@/sanity/lib/image'
import type { CoffeeShop } from '@/sanity/lib/queries'
import { priceLabel } from '@/app/_lib/format'

export function CoffeeShopCard({ shop }: { shop: CoffeeShop }) {
  return (
    <Link
      href={`/coffee-shops/${shop.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {shop.mainImage ? (
          <Image
            src={urlFor(shop.mainImage).width(800).height(600).fit('crop').auto('format').url()}
            alt={shop.mainImage.alt ?? shop.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No photo yet
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-sm font-semibold text-white backdrop-blur">
          ★ {shop.rating}/10
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            {shop.name}
          </h2>
          <span className="shrink-0 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            {priceLabel(shop.priceLevel)}
          </span>
        </div>
        {shop.shortDescription && (
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {shop.shortDescription}
          </p>
        )}
      </div>
    </Link>
  )
}
