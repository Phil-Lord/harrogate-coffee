import { defineQuery } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'

// Sanity image field with the required `alt` text.
export type CoffeeShopImage = SanityImageSource & { alt?: string }

// Fields shared by the landing list and the shop page.
export type CoffeeShop = {
  _id: string
  name: string
  slug: string
  shortDescription: string | null
  rating: number
  priceLevel: number
  mainImage: CoffeeShopImage | null
}

// Landing list: lightweight, sortable fields, ranked best-first.
export const COFFEE_SHOPS_QUERY = defineQuery(/* groq */ `
  *[_type == "coffeeShop" && defined(slug.current)]
  | order(rating desc, name asc) {
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    rating,
    priceLevel,
    mainImage
  }
`)

// Slugs for generateStaticParams.
export const COFFEE_SHOP_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "coffeeShop" && defined(slug.current)]{ "slug": slug.current }
`)

// A single shop by slug for the detail page.
export const COFFEE_SHOP_QUERY = defineQuery(/* groq */ `
  *[_type == "coffeeShop" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    rating,
    priceLevel,
    mainImage
  }
`)
