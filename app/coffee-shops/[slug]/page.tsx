import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { COFFEE_SHOP_QUERY, COFFEE_SHOP_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { COFFEE_SHOP_QUERY_RESULT } from '@/sanity.types'
import { PriceBadge, RatingBadge } from '@/app/_components/ShopBadges'
import { RichText } from '@/app/_components/RichText'

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
    <main className="mr-auto w-full max-w-5xl flex-1 px-6 py-12 sm:px-18">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-8 -ml-3')}
      >
        <ArrowLeft />
        All coffee shops
      </Link>

      {shop.mainImage && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={urlFor(shop.mainImage).width(1200).height(675).fit('crop').auto('format').url()}
            alt={shop.mainImage.alt ?? shop.name ?? ''}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            placeholder={shop.mainImage.lqip ? 'blur' : 'empty'}
            blurDataURL={shop.mainImage.lqip ?? undefined}
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          {shop.name}
        </h1>
        <PriceBadge level={shop.priceLevel} />
        <RatingBadge rating={shop.rating} />
      </div>

      {shop.shortDescription && (
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {shop.shortDescription}
        </p>
      )}

      {shop.description?.length ? (
        <>
          <Separator className="my-8" />
          <RichText value={shop.description} />
        </>
      ) : null}
    </main>
  )
}
