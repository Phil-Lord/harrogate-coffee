import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, studioUrl } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Off: we statically generate, so builds should read fresh (uncached) content
  // Encoding stays off until a fetch opts in — `sanityFetch` turns it on for
  // draft mode only, and defining `studioUrl` is the switch that allows it.
  stega: { studioUrl },
})
