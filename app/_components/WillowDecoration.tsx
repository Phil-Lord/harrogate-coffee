import Image from 'next/image'

import willow from '@/public/willow-placeholder.png'

/**
 * PLACEHOLDER ARTWORK — do not deploy.
 *
 * public/willow-placeholder.png is a free-tier Pngtree download: personal use
 * only, attribution required. It's gitignored so it can't reach Vercel, and
 * needs swapping for a properly licensed asset before this ships.
 */
export function WillowDecoration() {
  return (
    // Anchored to the viewport's right edge rather than main's, since main is
    // capped at max-w-5xl and pinned left — the empty space is outside it.
    // Absolute (not fixed) so it scrolls up under the opaque header and away.
    // Negative z-index keeps it behind the cards: body's background propagates
    // to the canvas, so nothing paints over it.
    //
    // xl and up only. Below that the viewport is narrower than main's 1024px
    // cap, so the full-width cards cover all but a few leaf tips and it reads
    // as fragments in the gaps rather than a branch.
    <div
      aria-hidden
      className="pointer-events-none absolute top-16 right-0 -z-10 hidden aspect-square w-[680px] select-none overflow-hidden xl:block 2xl:w-[820px]"
    >
      {/* The PNG bakes in transparent padding — 14.1% right, 5.7% top — which
          leaves the branches floating away from the corner. Shifting by exactly
          that much lands the artwork flush; overflow-hidden above crops the
          shifted-out padding so it can't widen the page. */}
      <Image
        src={willow}
        alt=""
        priority
        className="w-full translate-x-[14.1%] -translate-y-[5.7%] opacity-30"
      />
    </div>
  )
}
