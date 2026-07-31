// Viewer token, server-side only — it lets draft-mode requests read unpublished
// content. Not asserted: without it the site still builds and serves published
// content, only preview stops working.
export const readToken = process.env.SANITY_API_READ_TOKEN
