import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { sanityFetch } from '@/sanity/lib/live'
import { COFFEE_SHOP_QUERY, COFFEE_SHOP_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { COFFEE_SHOP_QUERY_RESULT } from '@/sanity.types'
import { ShopBadgeRow } from '@/app/_components/ShopBadges'
import { RichText } from '@/app/_components/RichText'
import { pageContainer } from '@/app/_lib/layout'

type Props = { params: Promise<{ slug: string }> }

// Pre-render a page per shop at build time.
export async function generateStaticParams() {
  return sanityFetch<{ slug: string }[]>({
    query: COFFEE_SHOP_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  // `stega: false` or the encoding's invisible characters end up in <title>
  // and <meta>, which is the search result this whole site is built to win.
  const shop = await sanityFetch<COFFEE_SHOP_QUERY_RESULT>({
    query: COFFEE_SHOP_QUERY,
    params: { slug },
    stega: false,
  })
  if (!shop) return {}
  return {
    title: `${shop.name} — Harrogate Coffee Shops`,
    description: shop.shortDescription ?? undefined,
  }
}

export default async function CoffeeShopPage({ params }: Props) {
  const { slug } = await params
  const shop = await sanityFetch<COFFEE_SHOP_QUERY_RESULT>({
    query: COFFEE_SHOP_QUERY,
    params: { slug },
  })
  if (!shop) notFound()

  return (
    <main className={cn(pageContainer, 'flex-1 py-12')}>
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
        <ShopBadgeRow shop={shop} className="flex-wrap gap-3" />
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
