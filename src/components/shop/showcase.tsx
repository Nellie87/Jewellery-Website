"use client"

import Image from "next/image"
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArrow } from "@/components/shop/icons"
import { useShop } from "@/components/shop/shop-provider"
import { formatPrice } from "@/lib/catalog"
import type { Shown } from "@/lib/slides"
import { cn } from "@/lib/utils"

// Desktop: sits inside the white cutouts and scales with the viewport.
const scrollHintClass =
  "absolute left-[70%] z-20 hidden -translate-x-1/2 items-center gap-2 font-serif text-[clamp(10px,0.85vw,13px)] font-semibold tracking-[0.2em] whitespace-nowrap text-black/55 uppercase transition-colors hover:text-black focus-visible:text-black focus-visible:outline-none lg:flex"

// Phones and tablets: no cutouts, so the hint sits under the watch.
const swipeHintClass =
  "absolute inset-x-0 z-20 flex items-center justify-center gap-5 font-serif text-[11px] font-semibold tracking-[0.2em] whitespace-nowrap text-black/60 uppercase sm:gap-8 sm:text-xs lg:hidden"

/** A ticking seconds hand pinned to the centre of the lens, synced to the wall clock. */
function TickingHand() {
  const stepRef = useRef<HTMLDivElement>(null)
  const beatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const now = (Date.now() / 1000) % 60
    if (stepRef.current) stepRef.current.style.animationDelay = `-${now}s`
    if (beatRef.current) beatRef.current.style.animationDelay = `-${now % 1}s`
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-10 motion-reduce:hidden" aria-hidden>
      <div ref={stepRef} className="seconds-step absolute inset-0">
        <div ref={beatRef} className="seconds-beat absolute inset-0">
          <span className="absolute bottom-1/2 left-1/2 h-[47%] w-px -translate-x-1/2 bg-[#ff4a3d] shadow-[0_0_3px_rgba(0,0,0,0.7)]" />
          <span className="absolute top-1/2 left-1/2 h-[11%] w-[2px] -translate-x-1/2 bg-[#ff4a3d] shadow-[0_0_3px_rgba(0,0,0,0.7)]" />
          <span className="absolute top-1/2 left-1/2 size-[3.5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4a3d] shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
        </div>
      </div>
    </div>
  )
}

/** The round close-up and the desktop prev/next hints. Goes behind the header. */
export function ShowcaseBackdrop({
  slide,
  onPrev,
  onNext,
}: {
  slide: Shown
  onPrev: () => void
  onNext: () => void
}) {
  const isJewellery = slide.jewel
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute hidden aspect-square -translate-x-1/2 overflow-hidden rounded-full lg:block",
          isJewellery
            ? "bottom-[3%] left-[40%] z-[15] w-[21cqw] border-[7px] border-[#f3f1ee] shadow-[0_0_0_0.6px_rgba(0,0,0,0.28)]"
            : "top-[80%] left-[41%] z-[5] h-[46%] -translate-y-1/2 bg-black shadow-[0_0_0_6px_#f3f1ee,0_0_0_6.6px_rgba(0,0,0,0.3)]"
        )}
        aria-hidden
      >
        <div key={slide.id} className="absolute inset-0 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
          <Image
            src={slide.lens.src}
            alt=""
            width={slide.lens.width}
            height={slide.lens.height}
            sizes="1100px"
            loading="eager"
            draggable={false}
            className="absolute max-w-none select-none"
            style={{
              width: `${(slide.lens.width / slide.lens.span) * 100}%`,
              height: `${(slide.lens.height / slide.lens.span) * 100}%`,
              left: `${50 - (slide.lens.x / slide.lens.span) * 100}%`,
              top: `${50 - (slide.lens.y / slide.lens.span) * 100}%`,
            }}
          />
        </div>
        {!isJewellery && <TickingHand />}
      </div>

      <button
        type="button"
        onClick={onPrev}
        className={cn(scrollHintClass, "top-[38px] -translate-y-1/2")}
        aria-label="Previous piece"
      >
        <ScrollArrow direction="up" />
        <span>
          <span className="pointer-coarse:hidden">Scroll up · </span>Prev
        </span>
      </button>
      <button
        type="button"
        onClick={onNext}
        className={cn(scrollHintClass, "bottom-[4.5%]")}
        aria-label="Next piece"
      >
        <span>
          <span className="pointer-coarse:hidden">Scroll down · </span>Next
        </span>
        <ScrollArrow direction="down" />
      </button>
    </>
  )
}

/** The copy on the left, the product photo on the right, and the numbered index. */
export function ShowcaseBody({
  slides,
  slide,
  onSelect,
  onPrev,
  onNext,
  dragProps,
  header,
  tagline,
}: {
  slides: Shown[]
  slide: Shown
  onSelect: (position: number) => void
  onPrev: () => void
  onNext: () => void
  dragProps: Pick<ComponentProps<"div">, "onPointerDown" | "onPointerUp">
  /** Rendered above the kicker, e.g. a link back to the jewellery edit. */
  header?: ReactNode
  tagline?: string
}) {
  const { addItem, added } = useShop()
  const isJewellery = slide.jewel

  const indexNav = (
    <ol className="flex items-center gap-3 sm:gap-5" aria-label="Pieces in this collection">
      {slides.map((item, position) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect(position)}
            aria-current={item.id === slide.id ? "true" : undefined}
            aria-label={`${item.code}, ${item.name}`}
            className={cn(
              "font-serif text-[15px] font-semibold tracking-[0.12em] transition-colors",
              item.id === slide.id ? "border-b border-black text-black" : "text-black/45 hover:text-black/80"
            )}
          >
            {item.code}
          </button>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="stage-body relative z-10 flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[40%_1fr] lg:grid-rows-1">
      <div className="hero-copy order-2 flex min-w-0 flex-col px-4 pb-3 sm:px-6 sm:pb-4 lg:order-none lg:px-0 lg:pb-0 lg:pl-[12%]">
        <div
          key={slide.id}
          className="hero-stack my-auto w-full max-w-full py-1 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
        >
          {header}
          <p className="hero-kicker font-serif text-[12px] font-semibold tracking-[0.22em] text-black/70 uppercase sm:text-[13px] sm:tracking-[0.3em]">
            {slide.kicker}
          </p>
          <h1 className="hero-title mt-3 font-display text-[clamp(1.55rem,3.3vw,3.6rem)] leading-[1.1] tracking-[0.02em] text-black uppercase">
            {slide.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-blurb mt-4 max-w-[300px] font-serif text-[16px] leading-[1.35] text-black/80 sm:text-[18px]">
            {slide.blurb}
          </p>
          {tagline && (
            <p className="hero-tagline mt-2 max-w-[300px] font-serif text-[14px] text-black/55 italic">{tagline}</p>
          )}
          <Button
            className="hero-cta mt-6 h-10 max-w-full rounded-[4px] bg-black px-5 text-[12px] font-semibold tracking-[0.14em] whitespace-normal text-white uppercase hover:bg-black/85 sm:px-6"
            onClick={() => addItem(slide.id)}
          >
            {added ? "Added to cart" : `Add to cart · ${formatPrice(slide.price)}`}
          </Button>
          {!isJewellery && <div className="hero-index-inline mt-8 hidden lg:block">{indexNav}</div>}
          <p className="sr-only" aria-live="polite">
            Showing {slide.code}, {slide.name}, {formatPrice(slide.price)}
          </p>
        </div>
      </div>

      <div className="hero-stage relative order-1 min-w-0 lg:order-none" {...dragProps}>
        {/* Below lg the Prev / Swipe / Next hint sits along the bottom; keep a framed photo clear of it. */}
        <div className={cn("absolute inset-0 flex items-center justify-center", slide.photo && "pb-9 lg:pb-0")}>
          {slide.photo ? (
            <div
              key={slide.id}
              className={cn(
                "relative z-10 aspect-[7/10] h-[84%] w-auto shrink-0 overflow-hidden rounded-t-full rounded-b-[18px] border-[#f3f1ee] bg-[#4a2a26] motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500",
                isJewellery
                  ? "border-[7px] shadow-[0_0_0_0.6px_rgba(0,0,0,0.28),0_22px_40px_-18px_rgba(60,25,20,0.45)] lg:h-auto lg:w-[18cqw]"
                  : "border-[6px] shadow-[0_0_0_0.6px_rgba(0,0,0,0.3),0_26px_44px_-14px_rgba(60,25,20,0.55)] lg:h-[88%]"
              )}
            >
              <Image
                src={slide.photo.src}
                alt={`${slide.name}, ${slide.material}`}
                width={slide.photo.width}
                height={slide.photo.height}
                loading="eager"
                sizes="(min-width: 1024px) 420px, 70vw"
                draggable={false}
                className="size-full select-none object-cover"
                style={{ transform: `scale(${slide.photo.zoom})`, transformOrigin: "50% 100%" }}
              />
            </div>
          ) : (
            <div
              key={slide.id}
              className="h-[112%] shrink-0 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500 lg:h-[118%]"
            >
              <Image
                src={slide.lens.src}
                alt={`${slide.name} watch, ${slide.material}`}
                width={720}
                height={1280}
                loading="eager"
                sizes="(min-width: 1024px) 520px, 70vw"
                draggable={false}
                className="relative z-10 h-full w-auto select-none drop-shadow-[0_26px_40px_rgba(0,0,0,0.55)]"
              />
            </div>
          )}
        </div>

        <div className={cn(swipeHintClass, "bottom-1")}>
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-1.5 py-2 transition-colors hover:text-black focus-visible:text-black focus-visible:outline-none"
            aria-label="Previous piece"
          >
            <ScrollArrow direction="left" />
            <span>Prev</span>
          </button>
          <span className="text-black/35" aria-hidden>
            Swipe
          </span>
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-1.5 py-2 transition-colors hover:text-black focus-visible:text-black focus-visible:outline-none"
            aria-label="Next piece"
          >
            <span>Next</span>
            <ScrollArrow direction="right" />
          </button>
        </div>
      </div>

      <div className="hero-index order-3 shrink-0 px-4 py-1.5 sm:px-6 sm:py-2 lg:hidden">{indexNav}</div>
    </div>
  )
}
