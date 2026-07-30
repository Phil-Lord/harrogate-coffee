import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '@/sanity/lib/client'
import { readToken } from '@/sanity/lib/token'

// Entry point for the Presentation tool's preview mode: it hands over a
// short-lived secret, this validates it against Sanity and sets the draft-mode
// cookie, after which every fetch reads drafts instead of published content.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
})
