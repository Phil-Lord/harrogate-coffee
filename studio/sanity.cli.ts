/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: 'ylqovn3m', dataset: 'production'},
  // Studio ships new Sanity versions without a redeploy. The deploy hostname
  // isn't configurable here in Studio 5 — it's the `--url` flag on the deploy
  // script in package.json.
  deployment: {appId: 'swuxaoojl4mowid1nyodyreo', autoUpdates: true},
  typegen: {
    // Queries live in the Next app, not here.
    path: '../{app,sanity}/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../sanity.types.ts',
    overloadClientMethods: false,
  },
})
