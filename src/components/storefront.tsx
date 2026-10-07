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
  watchImage,
  watchName,
  watches,
  type Collection,
  type Watch,
} from "@/lib/catalog"
import { cn } from "@/lib/utils"

type CartLine = { id: string; qty: number }

const iconButtonClass =
  "size-9 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/40 lg:text-black lg:hover:bg-black/10 lg:hover:text-black lg:focus-visible:ring-black/30"

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

function WatchThumb({ item }: { item: Watch }) {
  return (
    <Image
      src={watchImage(item)}
      alt=""
      width={720}
      height={1280}
      sizes="48px"
      className="h-16 w-9 shrink-0 rounded-md bg-white/5 object-cover object-center"
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
  const [collection, setCollection] = useState<Collection>("men")
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

  const list = collectionOf(collection)
  const watch = list[index] ?? list[0]
  const peek = list[((index >= list.length ? 0 : index) + 1) % list.length]
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

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return watches
    return watches.filter((item) =>
      [watchName(item), item.kicker, item.blurb, item.material, item.collection]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    )
  }, [query])

  function chooseCollection(next: Collection) {
    setCollection(next)
    setIndex(0)
    setMenuOpen(false)
  }

  function openWatch(item: Watch) {
    setCollection(item.collection)
    const nextList = collectionOf(item.collection)
    setIndex(Math.max(0, nextList.findIndex((entry) => entry.id === item.id)))
    setSearchOpen(false)
    setAccountOpen(false)
  }

  function addWatch(item: Watch = watch) {
    setCart((current) => {
      const existing = current.find((line) => line.id === item.id)
      if (existing) {
        return current.map((line) => (line.id === item.id ? { ...line, qty: line.qty + 1 } : line))
      }
      return [...current, { id: item.id, qty: 1 }]
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
    const item = watches.find((entry) => entry.id === line.id)
    return sum + (item ? item.price * line.qty : 0)
  }, 0)

  const savedWatches = saved
    .map((id) => watches.find((item) => item.id === id))
    .filter((item): item is Watch => Boolean(item))

  const indexNav = (
    <ol className="flex items-center gap-5" aria-label="Pieces in this collection">
      {list.map((item, position) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => setIndex(position)}
            aria-current={item.id === watch.id ? "true" : undefined}
            aria-label={`${item.code}, ${watchName(item)}`}
            className={cn(
              "font-serif text-[15px] font-semibold tracking-[0.12em] transition-colors",
              item.id === watch.id
                ? "border-b border-white text-white"
                : "text-white/45 hover:text-white/80"
            )}
          >
            {item.code}
          </button>
        </li>
      ))}
    </ol>
  )

  return (
    <div
      className="flex h-dvh p-[clamp(10px,2.6vh,28px)_clamp(10px,2vw,28px)] text-white transition-colors duration-700 ease-out"
      style={{ backgroundColor: watch.tone }}
    >
      <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
          <div
            className="absolute top-[8%] left-[70%] aspect-square h-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-700 ease-out"
            style={{ backgroundColor: watch.tone }}
          />
          <div
            className="absolute top-[123%] left-[70%] aspect-square h-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-700 ease-out"
            style={{ backgroundColor: watch.tone }}
          />
          <div
            className="absolute top-full left-[32%] aspect-square h-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-700 ease-out"
            style={{ backgroundColor: watch.tone }}
          />
        </div>

        <button
          type="button"
          onClick={() => setIndex((current) => (current + 1) % list.length)}
          aria-label={`Next piece: ${watchName(peek)}`}
          className="absolute top-[calc(100%-clamp(108px,20vh,168px))] left-[32%] z-[5] hidden w-[clamp(140px,16vw,230px)] -translate-x-1/2 cursor-pointer lg:block"
        >
          <Image
            key={peek.id}
            src={watchImage(peek)}
            alt=""
            width={720}
            height={1280}
            sizes="270px"
            draggable={false}
            className="h-auto w-full select-none opacity-95 transition-transform duration-500 hover:-translate-y-2 motion-safe:animate-in motion-safe:fade-in"
          />
        </button>

        <header className="relative z-20 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:grid lg:h-[76px] lg:grid-cols-[1fr_auto_1fr] lg:px-0 lg:py-0">
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
                </div>
                <p className="px-4 text-sm leading-6 text-white/75">
                  Piece 01 is the house case: rose gold around an open tourbillon. The other three change with the season. Arrow keys move between them.
                </p>
              </SheetContent>
            </Sheet>
            <p className="font-display text-[15px] tracking-[0.12em] uppercase sm:text-[17px]">S&apos;WATCH</p>
          </div>

          <div className="flex items-center justify-end gap-1 lg:contents">
            <nav className="hidden items-center gap-10 lg:flex" aria-label="Collections">
              {(["men", "women"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => chooseCollection(item)}
                  aria-pressed={collection === item}
                  className={cn(
                    "font-serif text-[15px] font-semibold tracking-[0.14em] text-white uppercase",
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
                aria-label="Search watches"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </Button>
              <DialogContent className="border-white/10 bg-[#1b201f] text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Search the case line</DialogTitle>
                  <DialogDescription className="text-white/65">
                    Look through both collections by strap, hour, or name.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (results[0]) openWatch(results[0])
                  }}
                >
                  <Input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try rose, olive, black"
                    className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </form>
                <ul className="max-h-72 space-y-1 overflow-auto">
                  {results.length === 0 ? (
                    <li className="px-1 py-6 text-sm text-white/70">
                      No case matches that. Try rose, olive, or black.
                    </li>
                  ) : (
                    results.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => openWatch(item)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/10"
                        >
                          <WatchThumb item={item} />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{watchName(item)}</span>
                            <span className="block text-xs tracking-wide text-white/55 uppercase">
                              {item.collection} Â· {formatPrice(item.price)}
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
                render={<Button variant="ghost" size="icon" className={iconButtonClass} aria-label="Saved watches" />}
              >
                <UserIcon />
              </SheetTrigger>
              <SheetContent className="border-white/10 bg-[#1b201f] text-white sm:max-w-md">
                <SheetHeader className="pr-8">
                  <SheetTitle className="text-white">Your list</SheetTitle>
                  <SheetDescription className="text-white/65">
                    Watches you want to come back to during this visit.
                  </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <Button
                    variant="outline"
                    className="h-10 w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    onClick={() => toggleSaved(watch.id)}
                  >
                    {saved.includes(watch.id) ? "Remove this watch" : "Keep this watch"}
                  </Button>
                </div>
                {savedWatches.length === 0 ? (
                  <p className="px-4 text-sm leading-6 text-white/70">
                    Nothing saved yet. The house case is the rose-gold tourbillon on slide 01.
                  </p>
                ) : (
                  <ul className="space-y-2 overflow-auto px-4">
                    {savedWatches.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <WatchThumb item={item} />
                        <button type="button" className="min-w-0 flex-1 text-left" onClick={() => openWatch(item)}>
                          <span className="block truncate text-sm font-medium">{watchName(item)}</span>
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
                      onClick={() => addWatch()}
                    >
                      Add {watch.lead} {watch.trail}
                    </Button>
                  </div>
                ) : (
                  <ul className="flex-1 space-y-4 overflow-auto px-4">
                    {cart.map((line) => {
                      const item = watches.find((entry) => entry.id === line.id)
                      if (!item) return null
                      return (
                        <li key={line.id} className="flex gap-3">
                          <WatchThumb item={item} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{watchName(item)}</p>
                            <p className="text-xs text-white/55">{item.material}</p>
                            <p className="mt-1 text-sm">{formatPrice(item.price)}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                onClick={() => setQty(line.id, line.qty - 1)}
                                aria-label={`Decrease ${watchName(item)}`}
                              >
                                âˆ’
                              </Button>
                              <span className="w-6 text-center text-sm">{line.qty}</span>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                onClick={() => setQty(line.id, line.qty + 1)}
                                aria-label={`Increase ${watchName(item)}`}
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
                      {reserving ? "Reservingâ€¦" : "Reserve order"}
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[40%_1fr] lg:grid-rows-1">
          <div className="order-2 flex items-center px-6 pb-4 lg:order-none lg:px-0 lg:pb-0 lg:pl-[12%]">
            <div key={watch.id} className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
              <p className="font-serif text-[12px] font-semibold tracking-[0.3em] text-white/70 uppercase sm:text-[13px]">
                {watch.kicker}
              </p>
              <h1 className="mt-3 font-display text-[clamp(1.9rem,3.3vw,3.6rem)] leading-[1.1] tracking-[0.02em] text-white uppercase">
                {watch.lead} {watch.trail}
                {(watch.lead2 || watch.trail2) && (
                  <>
                    <br />
                    {watch.lead2} {watch.trail2}
                  </>
                )}
              </h1>
              <p className="mt-4 max-w-[300px] font-serif text-[16px] leading-[1.35] text-white/90 sm:text-[18px]">
                {watch.blurb}
              </p>
              <Button
                className="mt-6 h-10 rounded-[4px] bg-white px-6 text-[12px] font-semibold tracking-[0.14em] text-black uppercase hover:bg-white/85"
                onClick={() => addWatch()}
              >
                {added ? "Added to cart" : `Add to cart · ${formatPrice(watch.price)}`}
              </Button>
              <div className="mt-8 hidden lg:block">{indexNav}</div>
              <p className="sr-only" aria-live="polite">
                Showing {watch.code}, {watchName(watch)}, {formatPrice(watch.price)}
              </p>
            </div>
          </div>

          <div
            className="relative order-1 h-[46vh] lg:order-none lg:h-auto"
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
              <div key={watch.id} className="h-[112%] shrink-0 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500 lg:h-[118%]">
                <Image
                  src={watchImage(watch)}
                  alt={`${watchName(watch)} watch, ${watch.material}`}
                  width={720}
                  height={1280}
                  preload
                  sizes="(min-width: 1024px) 520px, 70vw"
                  draggable={false}
                  className="relative z-10 h-full w-auto select-none drop-shadow-[0_26px_40px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>

          <div className="order-3 px-6 py-2 lg:hidden">{indexNav}</div>
        </div>

        <footer className="relative z-20 flex items-center justify-between px-5 py-3 sm:px-9 sm:pb-6">
          <div className="flex items-center gap-4">
            {(["facebook", "instagram", "twitter"] as const).map((kind) => (
              <Button
                key={kind}
                variant="ghost"
                size="icon"
                className="size-8 text-white hover:bg-white/10 hover:text-white"
                aria-label={kind}
                onClick={() => setStudioOpen(true)}
              >
                <SocialIcon kind={kind} />
              </Button>
            ))}
          </div>
          <nav className="flex gap-4 font-serif text-[14px] font-semibold tracking-[0.16em] text-white/80 uppercase lg:hidden" aria-label="Collections">
            {(["men", "women"] as const).map((item) => (
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
            aria-label="Next watch"
            onClick={() => setIndex((current) => (current + 1) % list.length)}
            className="flex h-8 w-[18px] items-center justify-center rounded-full border border-white/90 lg:border-black"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white lg:bg-black" />
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
              <li>Instagram Â· @swatch.atelier</li>
              <li>Journal notes go out with each season, not a feed.</li>
              <li>Studio visits are Thursday mornings, by the list.</li>
            </ul>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}
