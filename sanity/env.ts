export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-07-05'

// Where the deployed Studio lives. Setting it as `stega.studioUrl` on the
// client is what switches stega encoding on for draft-mode fetches, and it's
// where click-to-edit links point outside the Presentation tool.
export const studioUrl = 'https://harrogate-coffee.sanity.studio'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
