"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/catalog"
import { pearlEdit } from "@/lib/slides"
import { cn } from "@/lib/utils"

const pearlCuts: Record<string, { src: string; width: number; height: number }> = {
  "pearl-earrings": { src: "/jewellery/pearl-earrings-cut.png", width: 351, height: 445 },
  "pearl-pendant": { src: "/jewellery/pearl-pendant-cut.png", width: 255, height: 510 },
  "pearl-ring": { src: "/jewellery/pearl-ring-cut.png", width: 205, height: 248 },
}

function PearlPiece({
  position,
  featured,
  className,
  onOpen,
}: {
  position: number
  featured?: boolean
  className?: string
  onOpen: (position: number) => void
}) {
  const piece = pearlEdit.pieces[position]
  const cut = pearlCuts[piece.id]
  return (
    <button
      type="button"
      onClick={() => onOpen(position)}
      className={cn(
        "group flex min-w-0 flex-col items-center text-center focus-visible:outline-none",
        className
      )}
    >
      <Image
        src={cut.src}
        alt=""
        width={cut.width}
        height={cut.height}
        sizes={featured ? "(min-width: 640px) 280px, 46vw" : "(min-width: 640px) 180px, 34vw"}
        className={cn(
          "w-auto max-w-full object-contain drop-shadow-[0_16px_18px_rgba(70,36,28,0.18)] transition-transform duration-500 group-hover:-translate-y-1",
          featured ? "pearl-feature h-[clamp(96px,24cqh,180px)]" : "pearl-side h-[clamp(64px,13cqh,100px)]"
        )}
      />
      <p className="mt-2 max-w-full font-serif text-[10px] leading-tight tracking-[0.14em] text-[#1c2740] uppercase sm:mt-3 sm:text-[12px] sm:tracking-[0.18em]">
        {piece.name}
      </p>
      <p className="font-serif text-[clamp(15px,2.4vw,22px)] text-[#a68450] italic">{formatPrice(piece.price)}</p>
    </button>
  )
}

/** The jewellery landing view: the pearl set laid out together. */
export function PearlEdit({ onOpen }: { onOpen: (position: number) => void }) {
  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 pt-2 pb-3 sm:px-8 lg:px-12">
      <div className="grid w-full flex-1 grid-cols-2 content-between gap-x-3 gap-y-2 sm:grid-cols-3 sm:grid-rows-[auto_minmax(0,1fr)] sm:content-stretch sm:gap-x-8 lg:gap-x-12">
        <div className="pearl-copy col-span-2 max-w-[17rem] self-start justify-self-start sm:col-span-1 sm:col-start-1 sm:row-start-1 sm:max-w-[15rem] sm:pt-3 lg:max-w-xs lg:pt-8">
          <p className="font-serif text-[10px] font-medium tracking-[0.28em] text-[#a68450] uppercase sm:text-[12px]">
            {pearlEdit.kicker}
          </p>
          <h1 className="mt-2 font-display text-[clamp(1.7rem,6vw,3.15rem)] leading-[1.05] text-[#1c2740] sm:mt-3">
            {pearlEdit.title}
          </h1>
          <p className="mt-2 font-serif text-[14px] text-[#1c2740]/75 italic sm:mt-3 sm:text-[17px]">{pearlEdit.tagline}</p>
          <span className="mt-3 block h-px w-12 bg-[#c4a36a] sm:mt-4 sm:w-14" />
        </div>
        <PearlPiece
          position={1}
          featured
          onOpen={onOpen}
          className="col-span-2 self-center justify-self-center sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1"
        />
        <PearlPiece position={0} onOpen={onOpen} className="self-end sm:col-start-1 sm:row-start-2" />
        <PearlPiece position={2} onOpen={onOpen} className="self-end sm:col-start-3 sm:row-start-2" />
      </div>
      <button
        type="button"
        onClick={() => onOpen(1)}
        className="pearl-cta mx-auto mt-3 flex shrink-0 items-center gap-2.5 rounded-full border border-[#1c2740]/30 px-4 py-1.5 font-serif text-[13px] text-[#1c2740]/80 italic transition-colors hover:border-[#1c2740]/60 hover:text-[#1c2740] sm:mt-4 sm:text-[15px]"
      >
        <span className="flex size-4 items-center justify-center rounded-full border border-current" aria-hidden>
          <span className="size-1.5 rounded-full bg-current" />
        </span>
        Find your signature piece
      </button>
    </div>
  )
}
