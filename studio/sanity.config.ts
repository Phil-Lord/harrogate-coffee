import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schema} from './schemaTypes'
import {structure} from './structure'

// Duplicated from the Next app's `sanity/env.ts` rather than shared: the Studio
// is a separate Vite app, so it can't read `NEXT_PUBLIC_*` or import across the
// boundary. Both are public identifiers, not secrets.
const projectId = 'ylqovn3m'
const dataset = 'production'
const apiVersion = '2026-07-05'

export default defineConfig({
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
