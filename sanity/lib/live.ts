// The Live Content API: `sanityFetch` tags every query and `<SanityLive />`
// (rendered in the root layout) expires those tags when the content behind them
// changes, so a publish reaches the site in seconds with no ISR window.
// https://github.com/sanity-io/next-sanity#live-content-api
import { defineLive } from 'next-sanity/live'

import { client } from './client'
import { readToken } from './token'

const { sanityFetch: liveFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  // Drafts are only ever previewed inside the Presentation tool, which pushes
  // its own updates, so the token never has to be handed to a browser.
  browserToken: false,
})

export { SanityLive }

// TypeGen's client-method overloads are off (`overloadClientMethods: false`), so
// nothing infers a result type from the query string. Callers name the generated
// type instead, the same way they did with `client.fetch<T>`.
export async function sanityFetch<T>(
  options: Parameters<typeof liveFetch>[0]
): Promise<T> {
  const { data } = await liveFetch(options)
  return data as T
}
