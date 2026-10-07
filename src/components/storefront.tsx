"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import {
  collectionOf,
  formatPrice,
  jewelleryEdits,
  productById,
  products,
  watchImage,
  watchName,
  watches,
  type Collection,
  type Jewel,
  type JewelleryEdit,
  type Product,
  type Watch,
} from "@/lib/catalog"
import { cn } from "@/lib/utils"

type CartLine = { id: string; qty: number }

type View = Collection | "jewellery"

/** One slide, whether it is a watch or a piece of jewellery. */
type Shown = {
  id: string
  code: string
  kicker: string
  /** Heading lines, shown stacked. */
  lines: string[]
  name: string
  blurb: string
  price: number
  material: string
  tone: string
  jewel: boolean
  /** Photo the round close-up is cut from. */
  lens: { src: string; width: number; height: number; x: number; y: number; span: number }
  /** Photo shown in the hero frame (jewellery only; watches use the cut-out image). */
  photo?: { src: string; width: number; height: number; zoom: number }
}

function showWatch(item: Watch): Shown {
  return {
    id: item.id,
    code: item.code,
    kicker: item.kicker,
    lines: [`${item.lead} ${item.trail}`, [item.lead2, item.trail2].filter(Boolean).join(" ")].filter(Boolean),
    name: watchName(item),
    blurb: item.blurb,
    price: item.price,
    material: item.material,
    tone: item.tone,
    jewel: false,
    lens: { src: watchImage(item), width: 720, height: 1280, ...item.focus },
  }
}

function showJewel(item: Jewel, position: number, edit: JewelleryEdit): Shown {
  return {
    id: item.id,
    code: String(position + 1).padStart(2, "0"),
    kicker: `${edit.kicker} · ${item.label}`,
    lines: [item.name],
    name: item.name,
    blurb: item.blurb,
    price: item.price,
    material: item.material,
    tone: edit.tone,
    jewel: true,
    lens: { src: item.image, width: item.width, height: item.height, ...item.focus },
    photo: { src: item.image, width: item.width, height: item.height, zoom: item.zoom ?? 1 },
  }
}

const pearlEdit = jewelleryEdits[0]

const iconButtonClass =
  "size-9 text-black hover:bg-black/10 hover:text-black focus-visible:ring-black/30"

// Desktop: sits inside the white cutouts and scales with the viewport.
const scrollHintClass =
  "absolute left-[70%] z-20 hidden -translate-x-1/2 items-center gap-2 font-serif text-[clamp(10px,0.85vw,13px)] font-semibold tracking-[0.2em] whitespace-nowrap text-black/55 uppercase transition-colors hover:text-black focus-visible:text-black focus-visible:outline-none lg:flex"

// Phones and tablets: no cutouts, so the hint sits under the watch.
const swipeHintClass =
  "absolute inset-x-0 z-20 flex items-center justify-center gap-5 font-serif text-[11px] font-semibold tracking-[0.2em] whitespace-nowrap text-black/60 uppercase sm:gap-8 sm:text-xs lg:hidden"

function ScrollArrow({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d={
          direction === "up"
            ? "M2.5 7.5 6 4l3.5 3.5"
            : direction === "down"
              ? "M2.5 4.5 6 8l3.5-3.5"
              : direction === "left"
                ? "M7.5 2.5 4 6l3.5 3.5"
                : "M4.5 2.5 8 6 4.5 9.5"
        }
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2c1.4-2.6 3.6-3.9 6.5-3.9s5.1 1.3 6.5 3.9" strokeLinecap="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 7Z" />
      <path d="M8 7 9.2 4.8A1.5 1.5 0 0 1 10.5 4h3" strokeLinecap="round" />
      <circle cx="9" cy="19.5" r="1" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1" fill="currentColor" />
    </svg>
  )
}

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

function ProductThumb({ item }: { item: Product }) {
  return (
    <Image
      src={item.image}
      alt=""
      width={96}
      height={128}
      sizes="48px"
      className="h-16 w-12 shrink-0 rounded-md bg-white/5 object-cover object-center"
    />
  )
}

function SocialIcon({ kind }: { kind: "facebook" | "instagram" | "twitter" }) {
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M14.2 20v-7.1h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4H17V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.5v2.8H11.1V20h3.1Z" />
      </svg>
    )
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M19.6 7.4c-.6.3-1.2.4-1.9.5.7-.4 1.2-1.1 1.4-1.9-.6.4-1.4.7-2.1.9A3.3 3.3 0 0 0 12 9.7c0 .3 0 .5.1.8-2.7-.1-5.1-1.4-6.7-3.4-.3.5-.4 1-.4 1.6 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.3A6.6 6.6 0 0 1 4 17.6 9.3 9.3 0 0 0 9.1 19c5.1 0 7.9-4.2 7.9-7.9v-.4c.6-.4 1.1-.9 1.6-1.5-.5.2-1.1.4-1.7.5Z" />
    </svg>
  )
}

export function Storefront() {
  const [collection, setCollection] = useState<View>("men")
  const [index, setIndex] = useState(0)
  const [cart, setCart] = useState<CartLine[]>([])
  const [saved, setSaved] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [added, setAdded] = useState(false)
  const [reserving, setReserving] = useState(false)
  const [order, setOrder] = useState<string | null>(null)
  const dragX = useRef<number | null>(null)
  const wheelArmed = useRef(true)
  const wheelLock = useRef<number | null>(null)

  const isJewellery = collection === "jewellery"
  const list = useMemo<Shown[]>(
    () =>
      collection === "jewellery"
        ? pearlEdit.pieces.map((piece, position) => showJewel(piece, position, pearlEdit))
        : collectionOf(collection).map(showWatch),
    [collection]
  )
  const slide = list[index] ?? list[0]
  const count = cart.reduce((sum, line) => sum + line.qty, 0)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      if (menuOpen || searchOpen || cartOpen || accountOpen || studioOpen) return
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % list.length)
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + list.length) % list.length)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [accountOpen, cartOpen, list.length, menuOpen, searchOpen, studioOpen])

  useEffect(() => {
    function onWheel(event: WheelEvent) {
      if (menuOpen || searchOpen || cartOpen || accountOpen || studioOpen) return
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      let delta = event.deltaY
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight
      if (Math.abs(delta) < 8 || Math.abs(delta) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      if (wheelLock.current) window.clearTimeout(wheelLock.current)
      wheelLock.current = window.setTimeout(() => {
        wheelArmed.current = true
        wheelLock.current = null
      }, 280)
      if (!wheelArmed.current) return
      wheelArmed.current = false
      const step = delta > 0 ? 1 : -1
      setIndex((current) => (current + step + list.length) % list.length)
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", onWheel)
      if (wheelLock.current) window.clearTimeout(wheelLock.current)
      wheelLock.current = null
      wheelArmed.current = true
    }
  }, [accountOpen, cartOpen, list.length, menuOpen, searchOpen, studioOpen])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return products
    return products.filter((item) => item.keywords.toLowerCase().includes(needle))
  }, [query])

  function chooseCollection(next: View) {
    setCollection(next)
    setIndex(0)
    setMenuOpen(false)
  }

  function openProduct(item: Product) {
    const jewelIndex = pearlEdit.pieces.findIndex((piece) => piece.id === item.id)
    if (jewelIndex >= 0) {
      setCollection("jewellery")
      setIndex(jewelIndex)
    } else {
      const watchItem = watches.find((entry) => entry.id === item.id)
      if (watchItem) {
        setCollection(watchItem.collection)
        setIndex(Math.max(0, collectionOf(watchItem.collection).findIndex((entry) => entry.id === item.id)))
      }
    }
    setSearchOpen(false)
    setAccountOpen(false)
  }

  function addItem(id: string = slide.id) {
    setCart((current) => {
      const existing = current.find((line) => line.id === id)
      if (existing) {
        return current.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line))
      }
      return [...current, { id, qty: 1 }]
    })
    setOrder(null)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  function setQty(id: string, qty: number) {
    setCart((current) =>
      qty <= 0 ? current.filter((line) => line.id !== id) : current.map((line) => (line.id === id ? { ...line, qty } : line))
    )
  }

  async function reserve() {
    if (!cart.length || reserving) return
    setReserving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    const ref = `SW-${String(Date.now()).slice(-6)}`
    setOrder(ref)
    setCart([])
    setReserving(false)
  }

  function toggleSaved(id: string) {
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const subtotal = cart.reduce((sum, line) => {
    const item = productById(line.id)
    return sum + (item ? item.price * line.qty : 0)
  }, 0)

  const savedProducts = saved
    .map((id) => productById(id))
    .filter((item): item is Product => Boolean(item))

  const indexNav = (
    <ol className="flex items-center gap-3 sm:gap-5" aria-label="Pieces in this collection">
      {list.map((item, position) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => setIndex(position)}
            aria-current={item.id === slide.id ? "true" : undefined}
            aria-label={`${item.code}, ${item.name}`}
            className={cn(
              "font-serif text-[15px] font-semibold tracking-[0.12em] transition-colors",
              item.id === slide.id
                ? "border-b border-black text-black"
                : "text-black/45 hover:text-black/80"
            )}
          >
            {item.code}
          </button>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="flex h-dvh bg-[#f3f1ee] p-[clamp(10px,2.6vh,28px)_clamp(10px,2vw,28px)] text-[#1a1a1a]">
      <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden focusable="false">
        <defs>
          {/* Blur + re-threshold the alpha: rounds every sharp point where a cutout meets the card edge or another cutout. */}
          <filter id="card-round" colorInterpolationFilters="sRGB" x="-2%" y="-2%" width="104%" height="104%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feComponentTransfer in="blur">
              <feFuncA type="linear" slope="22" intercept="-10.5" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div className="card-stage relative flex min-h-0 flex-1">
        <div className="card-shadow pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="card-shape h-full w-full rounded-[20px] transition-colors duration-700 ease-out"
            data-plain={isJewellery ? "" : undefined}
            style={{ backgroundColor: slide.tone }}
          />
        </div>
      <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px]">
        <div
          className="pointer-events-none absolute top-[80%] left-[41%] z-[5] hidden aspect-square h-[46%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-black shadow-[0_0_0_6px_#f3f1ee,0_0_0_6.6px_rgba(0,0,0,0.3)] lg:block"
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
          onClick={() => setIndex((current) => (current - 1 + list.length) % list.length)}
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
          onClick={() => setIndex((current) => (current + 1) % list.length)}
          className={cn(scrollHintClass, "bottom-[4.5%]")}
          aria-label="Next piece"
        >
          <span>
            <span className="pointer-coarse:hidden">Scroll down · </span>Next
          </span>
          <ScrollArrow direction="down" />
        </button>

        <header className="relative z-20 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:grid lg:h-[76px] lg:grid-cols-[1fr_auto_1.6fr] lg:px-0 lg:py-0">
          <div className="flex items-center gap-3 sm:gap-4 lg:pl-9">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className={iconButtonClass} aria-label="Open menu" />
                }
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="left" className="border-white/10 bg-[#1b201f] text-white sm:max-w-md">
                <SheetHeader className="pr-8">
                  <SheetTitle className="text-lg tracking-[0.16em] text-white">S&apos;WATCH</SheetTitle>
                  <SheetDescription className="text-white/70">
                    Four cases a season, finished by hand in Lisbon.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 px-4">
                  <Button
                    variant="ghost"
                    className="h-12 justify-start rounded-none px-0 text-2xl font-medium text-white hover:bg-transparent hover:text-[#e6c9b2]"
                    onClick={() => chooseCollection("men")}
                  >
                    Men
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 justify-start rounded-none px-0 text-2xl font-medium text-white hover:bg-transparent hover:text-[#e6c9b2]"
                    onClick={() => chooseCollection("women")}
                  >
                    Women
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 justify-start rounded-none px-0 text-2xl font-medium text-white hover:bg-transparent hover:text-[#e6c9b2]"
                    onClick={() => chooseCollection("jewellery")}
                  >
                    Jewellery
                  </Button>
                </div>
                <p className="px-4 text-sm leading-6 text-white/75">
                  {isJewellery
                    ? `${pearlEdit.title}. ${pearlEdit.tagline} Arrow keys move between pieces.`
                    : "Piece 01 is the house case: rose gold around an open tourbillon. The other three change with the season. Arrow keys move between them."}
                </p>
              </SheetContent>
            </Sheet>
            <p className="font-display text-[15px] tracking-[0.12em] uppercase sm:text-[17px]">S&apos;WATCH</p>
          </div>

          <div className="flex items-center justify-end gap-1 lg:contents">
            <nav className="hidden items-center gap-5 lg:flex xl:gap-10" aria-label="Collections">
              {(["men", "women", "jewellery"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => chooseCollection(item)}
                  aria-pressed={collection === item}
                  className={cn(
                    "font-serif text-[13px] font-semibold tracking-[0.12em] text-black uppercase xl:text-[15px] xl:tracking-[0.14em]",
                    collection === item && "underline decoration-1 underline-offset-[8px]"
                  )}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-1 lg:justify-self-end lg:pr-8">
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <Button
                variant="ghost"
                size="icon"
                className={iconButtonClass}
                aria-label="Search the collection"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </Button>
              <DialogContent className="border-white/10 bg-[#1b201f] text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Search the collection</DialogTitle>
                  <DialogDescription className="text-white/65">
                    Look through watches and jewellery by material, strap, or name.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (results[0]) openProduct(results[0])
                  }}
                >
                  <Input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try rose, olive, pearl"
                    className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </form>
                <ul className="max-h-72 space-y-1 overflow-auto">
                  {results.length === 0 ? (
                    <li className="px-1 py-6 text-sm text-white/70">
                      Nothing matches that. Try rose, olive, or pearl.
                    </li>
                  ) : (
                    results.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => openProduct(item)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/10"
                        >
                          <ProductThumb item={item} />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{item.name}</span>
                            <span className="block text-xs tracking-wide text-white/55 uppercase">
                              {item.category} · {formatPrice(item.price)}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </DialogContent>
            </Dialog>

            <Sheet open={accountOpen} onOpenChange={setAccountOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className={iconButtonClass} aria-label="Saved pieces" />}
              >
                <UserIcon />
              </SheetTrigger>
              <SheetContent className="border-white/10 bg-[#1b201f] text-white sm:max-w-md">
                <SheetHeader className="pr-8">
                  <SheetTitle className="text-white">Your list</SheetTitle>
                  <SheetDescription className="text-white/65">
                    Pieces you want to come back to during this visit.
                  </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <Button
                    variant="outline"
                    className="h-10 w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    onClick={() => toggleSaved(slide.id)}
                  >
                    {saved.includes(slide.id) ? "Remove this piece" : "Keep this piece"}
                  </Button>
                </div>
                {savedProducts.length === 0 ? (
                  <p className="px-4 text-sm leading-6 text-white/70">
                    Nothing saved yet. The house case is the rose-gold tourbillon on slide 01.
                  </p>
                ) : (
                  <ul className="space-y-2 overflow-auto px-4">
                    {savedProducts.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <ProductThumb item={item} />
                        <button type="button" className="min-w-0 flex-1 text-left" onClick={() => openProduct(item)}>
                          <span className="block truncate text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-white/55">{formatPrice(item.price)}</span>
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/70 hover:bg-white/10 hover:text-white"
                          onClick={() => toggleSaved(item.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </SheetContent>
            </Sheet>

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <span className="relative">
                <SheetTrigger
                  render={<Button variant="ghost" size="icon" className={iconButtonClass} aria-label="Open cart" />}
                >
                  <CartIcon />
                </SheetTrigger>
                {count > 0 && (
                  <span className="pointer-events-none absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#e25c34] text-[10px] font-semibold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
              <SheetContent className="border-white/10 bg-[#1b201f] text-white sm:max-w-md">
                <SheetHeader className="pr-8">
                  <SheetTitle className="text-white">Cart</SheetTitle>
                  <SheetDescription className="text-white/65">
                    {order ? `Reference ${order}` : "Pieces held until you reserve them."}
                  </SheetDescription>
                </SheetHeader>
                {order ? (
                  <div className="space-y-3 px-4">
                    <p className="text-lg font-medium">Held for you.</p>
                    <p className="text-sm leading-6 text-white/75">
                      Reference {order} is with the Lisbon bench. They confirm the strap before anything ships.
                    </p>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="space-y-4 px-4">
                    <p className="text-sm leading-6 text-white/75">
                      The cart is empty. Most people start with the rose-gold tourbillon.
                    </p>
                    <Button
                      className="h-10 rounded-[3px] bg-[#e6e8e7] text-[#1c1c1c] hover:bg-white"
                      onClick={() => addItem()}
                    >
                      Add {slide.name}
                    </Button>
                  </div>
                ) : (
                  <ul className="flex-1 space-y-4 overflow-auto px-4">
                    {cart.map((line) => {
                      const item = productById(line.id)
                      if (!item) return null
                      return (
                        <li key={line.id} className="flex gap-3">
                          <ProductThumb item={item} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-white/55">{item.detail}</p>
                            <p className="mt-1 text-sm">{formatPrice(item.price)}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                onClick={() => setQty(line.id, line.qty - 1)}
                                aria-label={`Decrease ${item.name}`}
                              >
                                −
                              </Button>
                              <span className="w-6 text-center text-sm">{line.qty}</span>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                onClick={() => setQty(line.id, line.qty + 1)}
                                aria-label={`Increase ${item.name}`}
                              >
                                +
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto text-white/60 hover:bg-white/10 hover:text-white"
                                onClick={() => setQty(line.id, 0)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
                {!order && cart.length > 0 && (
                  <SheetFooter className="border-t border-white/10">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/65">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <Button
                      className="h-10 rounded-[3px] bg-[#e6e8e7] text-[#1c1c1c] hover:bg-white"
                      disabled={reserving}
                      onClick={reserve}
                    >
                      {reserving ? "Reserving…" : "Reserve order"}
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </header>

        <div className="stage-body relative z-10 flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[40%_1fr] lg:grid-rows-1">
          <div className="hero-copy order-2 flex min-w-0 flex-col px-4 pb-3 sm:px-6 sm:pb-4 lg:order-none lg:px-0 lg:pb-0 lg:pl-[12%]">
            <div key={slide.id} className="hero-stack my-auto w-full max-w-full py-1 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
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
              {isJewellery && (
                <p className="hero-tagline mt-2 max-w-[300px] font-serif text-[14px] text-black/55 italic">{pearlEdit.tagline}</p>
              )}
              <Button
                className="hero-cta mt-6 h-10 max-w-full rounded-[4px] bg-black px-5 text-[12px] font-semibold tracking-[0.14em] whitespace-normal text-white uppercase hover:bg-black/85 sm:px-6"
                onClick={() => addItem()}
              >
                {added ? "Added to cart" : `Add to cart · ${formatPrice(slide.price)}`}
              </Button>
              <div className="hero-index-inline mt-8 hidden lg:block">{indexNav}</div>
              <p className="sr-only" aria-live="polite">
                Showing {slide.code}, {slide.name}, {formatPrice(slide.price)}
              </p>
            </div>
          </div>

          <div
            className="hero-stage relative order-1 min-w-0 lg:order-none"
            onPointerDown={(event) => {
              dragX.current = event.clientX
            }}
            onPointerUp={(event) => {
              if (dragX.current == null) return
              const delta = event.clientX - dragX.current
              if (delta > 48) setIndex((current) => (current - 1 + list.length) % list.length)
              if (delta < -48) setIndex((current) => (current + 1) % list.length)
              dragX.current = null
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {slide.photo ? (
                <div
                  key={slide.id}
                  className="relative z-10 aspect-[7/10] h-[84%] shrink-0 overflow-hidden rounded-t-full rounded-b-[18px] border-[6px] border-[#f3f1ee] bg-[#4a2a26] shadow-[0_0_0_0.6px_rgba(0,0,0,0.3),0_26px_44px_-14px_rgba(60,25,20,0.55)] motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500 lg:h-[88%]"
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
                <div key={slide.id} className="h-[112%] shrink-0 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500 lg:h-[118%]">
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
                onClick={() => setIndex((current) => (current - 1 + list.length) % list.length)}
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
                onClick={() => setIndex((current) => (current + 1) % list.length)}
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

        <footer className="site-footer relative z-20 flex shrink-0 items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-9 sm:py-3 sm:pb-6">
          <div className="footer-socials flex shrink-0 items-center gap-1 sm:gap-4">
            {(["facebook", "instagram", "twitter"] as const).map((kind) => (
              <Button
                key={kind}
                variant="ghost"
                size="icon"
                className="size-8 text-black hover:bg-black/10 hover:text-black"
                aria-label={kind}
                onClick={() => setStudioOpen(true)}
              >
                <SocialIcon kind={kind} />
              </Button>
            ))}
          </div>
          <nav className="footer-nav flex min-w-0 justify-end gap-2 font-serif text-[11px] font-semibold tracking-[0.08em] text-black/80 uppercase sm:gap-4 sm:text-[14px] sm:tracking-[0.16em] lg:hidden" aria-label="Collections">
            {(["men", "women", "jewellery"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => chooseCollection(item)}
                className={cn(collection === item && "underline decoration-1 underline-offset-4")}
              >
                {item}
              </button>
            ))}
          </nav>
          <button
            type="button"
            aria-label="Next piece"
            onClick={() => setIndex((current) => (current + 1) % list.length)}
            className="flex h-8 w-[18px] shrink-0 items-center justify-center rounded-full border border-black"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
          </button>
        </footer>

        <Dialog open={studioOpen} onOpenChange={setStudioOpen}>
          <DialogContent className="border-white/10 bg-[#1b201f] text-white sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-white">The studio</DialogTitle>
              <DialogDescription className="text-white/65">
                S&apos;WATCH keeps a quiet bench in Lisbon. These are the channels the house actually uses.
              </DialogDescription>
            </DialogHeader>
            <ul className="space-y-2 text-sm">
              <li>Instagram · @swatch.atelier</li>
              <li>Journal notes go out with each season, not a feed.</li>
              <li>Studio visits are Thursday mornings, by the list.</li>
            </ul>
          </DialogContent>
        </Dialog>
      </section>
      </div>
    </div>
  )
}
