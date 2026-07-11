import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { urlFor } from '@/sanity/lib/image'
import type { CoffeeShop } from '@/sanity/lib/queries'
import { priceLabel } from '@/app/_lib/format'

export function CoffeeShopCard({ shop }: { shop: CoffeeShop }) {
  return (
    <Link href={`/coffee-shops/${shop.slug}`} className="group block h-full">
      <Card className="h-full gap-0 p-0 transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {shop.mainImage ? (
            <Image
              src={urlFor(shop.mainImage).width(800).height(600).fit('crop').auto('format').url()}
              alt={shop.mainImage.alt ?? shop.name}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No photo yet
            </div>
          )}
          <Badge className="absolute top-3 right-3 gap-1 bg-background/80 text-foreground backdrop-blur">
            <Star className="fill-current" />
            {shop.rating}/10
          </Badge>
        </div>

        <CardContent className="flex flex-col gap-1.5 py-4">
          <div className="flex items-baseline justify-between gap-2">
            <CardTitle className="text-lg">{shop.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {priceLabel(shop.priceLevel)}
            </Badge>
          </div>
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
