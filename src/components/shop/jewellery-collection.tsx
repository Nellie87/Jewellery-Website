"use client"

import { useMemo, useState } from "react"
import { PearlEdit } from "@/components/shop/pearl-edit"
import { ShowcaseBackdrop, ShowcaseBody } from "@/components/shop/showcase"
import { Stage } from "@/components/shop/stage"
import { useSlider } from "@/components/shop/use-slider"
import { pearlEdit, showJewel } from "@/lib/slides"

/** The jewellery page: the pearl edit, then each piece in turn. */
export function JewelleryCollection({ piece }: { piece?: string }) {
  const slides = useMemo(() => pearlEdit.pieces.map((item, position) => showJewel(item, position, pearlEdit)), [])
  const opened = slides.findIndex((item) => item.id === piece)
  const [pieceOpen, setPieceOpen] = useState(opened >= 0)
  const { index, setIndex, next, prev, dragProps } = useSlider(slides.length, {
    initial: Math.max(0, opened),
    enabled: pieceOpen,
  })
  const slide = slides[index] ?? slides[0]

  function openPiece(position: number) {
    setIndex(position)
    setPieceOpen(true)
  }

  return (
    <Stage
      view="jewellery"
      tone={slide.tone}
      plain
      current={slide}
      onNext={pieceOpen ? next : undefined}
      menuNote={`${pearlEdit.title}. ${pearlEdit.tagline} Arrow keys move between pieces.`}
      backdrop={pieceOpen ? <ShowcaseBackdrop slide={slide} onPrev={prev} onNext={next} /> : null}
    >
      {pieceOpen ? (
        <ShowcaseBody
          slides={slides}
          slide={slide}
          onSelect={setIndex}
          onPrev={prev}
          onNext={next}
          dragProps={dragProps}
          tagline={pearlEdit.tagline}
          header={
            <button
              type="button"
              onClick={() => setPieceOpen(false)}
              className="mb-4 font-serif text-[12px] tracking-[0.18em] text-black/55 uppercase transition-colors hover:text-black"
            >
              ← The edit
            </button>
          }
        />
      ) : (
        <PearlEdit onOpen={openPiece} />
      )}
    </Stage>
  )
}
