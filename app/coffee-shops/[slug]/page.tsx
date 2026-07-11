import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { COFFEE_SHOP_QUERY, COFFEE_SHOP_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { COFFEE_SHOP_QUERY_RESULT } from '@/sanity.types'
import { priceLabel } from '@/app/_lib/format'

type Props = { params: Promise<{ slug: string }> }

// Statically generated, refreshed at most hourly (ISR).
export const revalidate = 3600

// Pre-render a page per shop at build time.
export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch<{ slug: string }[]>(COFFEE_SHOP_SLUGS_QUERY)
  return slugs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const shop = await client.fetch<COFFEE_SHOP_QUERY_RESULT>(COFFEE_SHOP_QUERY, { slug })
  if (!shop) return {}
  return {
    title: `${shop.name} — Harrogate Coffee Shops`,
    description: shop.shortDescription ?? undefined,
  }
}

export default async function CoffeeShopPage({ params }: Props) {
  const { slug } = await params
  const shop = await client.fetch<COFFEE_SHOP_QUERY_RESULT>(COFFEE_SHOP_QUERY, { slug })
  if (!shop) notFound()

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-500 transition hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        ← All coffee shops
      </Link>

      {shop.mainImage && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={urlFor(shop.mainImage).width(1200).height(675).fit('crop').auto('format').url()}
            alt={shop.mainImage.alt ?? shop.name ?? ''}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {shop.name}
        </h1>
        <span className="rounded-full bg-black px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-black">
          ★ {shop.rating}/10
        </span>
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {priceLabel(shop.priceLevel)}
        </span>
      </div>

      {shop.shortDescription && (
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {shop.shortDescription}
        </p>
      )}
    </main>
  )
}
