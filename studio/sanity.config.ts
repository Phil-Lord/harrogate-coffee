import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {resolve} from './presentation'
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
    // Live preview of the site beside the editor, with click-to-edit back into
    // the field. The deployed Studio previews the deployed site, so Jess needs
    // nothing running locally; `sanity dev` previews `next dev` instead.
    presentationTool({
      resolve,
      previewUrl: {
        initial: ({origin}: {origin: string}) =>
          origin.startsWith('http://localhost')
            ? 'http://localhost:3000'
            : 'https://harrogate-coffee.vercel.app',
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
