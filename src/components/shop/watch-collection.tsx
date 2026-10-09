"use client"

import { useMemo } from "react"
import { ShowcaseBackdrop, ShowcaseBody } from "@/components/shop/showcase"
import { Stage } from "@/components/shop/stage"
import { useSlider } from "@/components/shop/use-slider"
import { collectionOf, type Collection } from "@/lib/catalog"
import { showWatch } from "@/lib/slides"

/** One watch collection (men or women): four pieces you step through. */
export function WatchCollection({ collection, piece }: { collection: Collection; piece?: string }) {
  const slides = useMemo(() => collectionOf(collection).map(showWatch), [collection])
  const { index, setIndex, next, prev, dragProps } = useSlider(slides.length, {
    initial: Math.max(0, slides.findIndex((item) => item.id === piece)),
  })
  const slide = slides[index] ?? slides[0]

  return (
    <Stage
      view={collection}
      tone={slide.tone}
      current={slide}
      onNext={next}
      menuNote="Piece 01 is the house case: rose gold around an open tourbillon. The other three change with the season. Arrow keys move between them."
      backdrop={<ShowcaseBackdrop slide={slide} onPrev={prev} onNext={next} />}
    >
      <ShowcaseBody
        slides={slides}
        slide={slide}
        onSelect={setIndex}
        onPrev={prev}
        onNext={next}
        dragProps={dragProps}
      />
    </Stage>
  )
}
