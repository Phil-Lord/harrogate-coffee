import { PortableText } from 'next-sanity'

import type { COFFEE_SHOP_QUERY_RESULT } from '@/sanity.types'

// Portable Text blocks as they come off a shop query.
type Blocks = NonNullable<COFFEE_SHOP_QUERY_RESULT>['description']

// Renders Sanity Portable Text with styling that matches the rest of the site.
// Passing `components` inline keeps the render callbacks contextually typed.
export function RichText({ value }: { value: Blocks }) {
  if (!value?.length) return null

  return (
    <div className="space-y-4 text-lg leading-8 text-muted-foreground">
      <PortableText
        value={value}
        components={{
          block: {
            normal: ({ children }) => <p>{children}</p>,
            h2: ({ children }) => (
              <h2 className="pt-4 text-2xl font-semibold tracking-tight text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="pt-2 text-xl font-semibold tracking-tight text-foreground">
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-border pl-4 italic">
                {children}
              </blockquote>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul className="list-disc space-y-1 pl-6">{children}</ul>
            ),
            number: ({ children }) => (
              <ol className="list-decimal space-y-1 pl-6">{children}</ol>
            ),
          },
          marks: {
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            link: ({ children, value }) => (
              <a
                href={value?.href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-primary underline underline-offset-4"
              >
                {children}
              </a>
            ),
          },
        }}
      />
    </div>
  )
}
