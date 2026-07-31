import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

// Where each document shows up on the site, so the Presentation tool can jump
// straight from a document to its page.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    coffeeShop: defineLocations({
      select: {name: 'name', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.name || 'Untitled', href: `/coffee-shops/${doc?.slug}`},
          {title: 'All coffee shops', href: '/'},
        ],
      }),
    }),
  },
  // The reverse: which document the editor pane should open as the preview
  // iframe is navigated around.
  mainDocuments: defineDocuments([
    {
      route: '/coffee-shops/:slug',
      filter: `_type == "coffeeShop" && slug.current == $slug`,
    },
  ]),
}
