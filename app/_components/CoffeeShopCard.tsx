import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { urlFor } from '@/sanity/lib/image'
import type { COFFEE_SHOPS_QUERY_RESULT } from '@/sanity.types'
import { priceLabel } from '@/app/_lib/format'

type Shop = COFFEE_SHOPS_QUERY_RESULT[number]

export function CoffeeShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/coffee-shops/${shop.slug}`} className="group block">
      <Card className="flex-col gap-0 p-0 transition-shadow hover:shadow-lg sm:min-h-44 sm:flex-row">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-64">
          {shop.mainImage ? (
            <Image
              src={urlFor(shop.mainImage).width(800).height(600).fit('crop').auto('format').url()}
              alt={shop.mainImage.alt ?? shop.name ?? ''}
              fill
              sizes="(min-width: 640px) 256px, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No photo yet
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-2 py-5">
          <div className="flex items-baseline justify-between gap-3">
            <CardTitle className="text-lg">{shop.name}</CardTitle>
            <Badge className="shrink-0 gap-1">
              <Star className="fill-current" />
              {shop.rating}/10
            </Badge>
          </div>
          <Badge variant="secondary" className="w-fit">
            {priceLabel(shop.priceLevel)}
          </Badge>
          {shop.shortDescription && (
            <p className="text-sm leading-6 text-muted-foreground">
              {shop.shortDescription}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
