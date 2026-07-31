import Image from 'next/image'
import { PortableText } from 'next-sanity'

import { urlFor } from '@/sanity/lib/image'
import type { COFFEE_SHOP_QUERY_RESULT } from '@/sanity.types'

// Portable Text blocks as they come off a shop query.
type Blocks = NonNullable<COFFEE_SHOP_QUERY_RESULT>['description']
type InlineImage = Extract<NonNullable<Blocks>[number], { _type: 'inlineImage' }>

// Widest the prose column ever gets (`pageContainer` at max-w-5xl, less padding).
const PROSE_WIDTH = 880
const FALLBACK_ASPECT = 3 / 2

// `dimensions` describes the uploaded asset, so a cropped photo would reserve
// the wrong height and shift the page as it loads.
function aspectRatio({ dimensions, crop }: InlineImage) {
  if (!dimensions?.width || !dimensions?.height) return FALLBACK_ASPECT
  const width = dimensions.width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))
  const height = dimensions.height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))
  return width / height
}

function InlineImageBlock({ value }: { value: InlineImage }) {
  if (!value.asset) return null

  const width = PROSE_WIDTH * 2
  const height = Math.round(width / aspectRatio(value))

  return (
    <figure className="my-8">
      <Image
        src={urlFor(value).width(width).auto('format').url()}
        alt={value.alt ?? ''}
        width={width}
        height={height}
        sizes={`(min-width: 1024px) ${PROSE_WIDTH}px, 100vw`}
        placeholder={value.lqip ? 'blur' : 'empty'}
        blurDataURL={value.lqip ?? undefined}
        className="h-auto w-full rounded-2xl bg-muted"
      />
      {value.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {value.caption}
        </figcaption>
      )}
    </figure>
  )
}

// Renders Sanity Portable Text with styling that matches the rest of the site.
// Passing `components` inline keeps the render callbacks contextually typed.
export function RichText({ value }: { value: Blocks }) {
  if (!value?.length) return null

  return (
    <div className="space-y-4 text-lg leading-8 text-muted-foreground">
      <PortableText
        value={value}
        components={{
          types: {
            inlineImage: ({ value }) => <InlineImageBlock value={value} />,
          },
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
