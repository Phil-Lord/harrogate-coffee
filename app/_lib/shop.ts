import type { COFFEE_SHOPS_QUERY_RESULT } from '@/sanity.types'

export type Shop = COFFEE_SHOPS_QUERY_RESULT[number]

// These values come from the Studio dropdowns in `sanity/schemaTypes/coffeeShop.ts`
// and should appear nowhere else in the app.

export function isIndependent(ownership: Shop['ownership']) {
  return ownership === 'independent'
}

export function isChain(ownership: Shop['ownership']) {
  return ownership === 'chain'
}

export function isDogFriendly(dogFriendly: Shop['dogFriendly']) {
  return dogFriendly === 'yes'
}

export type ShopFilters = {
  independentOnly: boolean
  dogFriendlyOnly: boolean
}

export function filterShops(shops: Shop[], filters: ShopFilters) {
  return shops.filter(
    (shop) =>
      (!filters.independentOnly || isIndependent(shop.ownership)) &&
      (!filters.dogFriendlyOnly || isDogFriendly(shop.dogFriendly)),
  )
}

export type ShopSort = 'rating' | 'value'

// Affordability runs 1–10 with 10 the cheapest, so best value is descending.
function byValue(a: Shop, b: Shop) {
  const rank = (shop: Shop) => shop.affordability ?? -Infinity
  return rank(b) - rank(a) || (a.name ?? '').localeCompare(b.name ?? '')
}

export function sortShops(shops: Shop[], sort: ShopSort) {
  // The query already returns the list best-rated first.
  return sort === 'value' ? [...shops].sort(byValue) : shops
}
