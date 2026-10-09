"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, type ReactNode } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { CartIcon, MenuIcon, SearchIcon, SocialIcon, UserIcon } from "@/components/shop/icons"
import { useShop, type Overlay } from "@/components/shop/shop-provider"
import { formatPrice, productById, products, type Product } from "@/lib/catalog"
import { productHref, viewHref, views, type View } from "@/lib/routes"
import { cn } from "@/lib/utils"

const iconButtonClass =
  "size-9 text-black hover:bg-black/10 hover:text-black focus-visible:ring-black/30"

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

type StageProps = {
  /** Which page this is; highlights it in the navigation. */
  view: View
  /** Backdrop colour of the card. */
  tone: string
  /** Keeps the card a plain rounded rectangle (no cut-out circles). */
  plain?: boolean
  /** Line shown under the links in the mobile menu. */
  menuNote: string
  /** The piece on screen, which the cart and saved list act on. */
  current: { id: string; name: string }
  /** Drawn behind the header, e.g. the round close-up. */
  backdrop?: ReactNode
  /** Shows the round "next piece" button in the footer. */
  onNext?: () => void
  children: ReactNode
}

/**
 * The frame shared by every page: card, header with navigation, search, saved
 * list and cart drawers, and the footer. Pages render their own content inside it.
 */
export function Stage({ view, tone, plain, menuNote, current, backdrop, onNext, children }: StageProps) {
  const router = useRouter()
  const {
    cart,
    count,
    subtotal,
    saved,
    savedProducts,
    order,
    reserving,
    overlay,
    setOverlay,
    addItem,
    setQty,
    reserve,
    toggleSaved,
  } = useShop()
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return products
    return products.filter((item) => item.keywords.toLowerCase().includes(needle))
  }, [query])

  const bind = (name: Overlay) => ({
    open: overlay === name,
    onOpenChange: (open: boolean) => setOverlay(open ? name : overlay === name ? null : overlay),
  })

  function openProduct(item: Product) {
    const href = productHref(item.id)
    setOverlay(null)
    if (href) router.push(href)
  }

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
            data-plain={plain ? "solid" : undefined}
            style={{ backgroundColor: tone }}
          />
        </div>
        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px]">
          {backdrop}

          <header className="relative z-20 flex items-center justify-between gap-2 px-3 py-3 min-[360px]:px-4 min-[360px]:py-4 sm:gap-3 sm:px-6 lg:grid lg:h-[76px] lg:grid-cols-[1fr_auto_1.6fr] lg:px-0 lg:py-0">
            <div className="flex min-w-0 items-center gap-2 min-[360px]:gap-3 sm:gap-4 lg:pl-9">
              <Sheet {...bind("menu")}>
                <SheetTrigger
                  render={<Button variant="ghost" size="icon" className={iconButtonClass} aria-label="Open menu" />}
                >
                  <MenuIcon />
                </SheetTrigger>
                <SheetContent side="left" className="border-white/10 bg-[#1b201f] text-white sm:max-w-md">
                  <SheetHeader className="pr-8">
                    <SheetTitle className="text-lg tracking-[0.16em] text-white">WATCH OUT</SheetTitle>
                    <SheetDescription className="text-white/70">
                      Four cases a season, finished by hand in Lisbon.
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 px-4" aria-label="Collections">
                    {views.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setOverlay(null)}
                        aria-current={view === item.id ? "page" : undefined}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "h-12 justify-start rounded-none px-0 text-2xl font-medium text-white hover:bg-transparent hover:text-[#e6c9b2]"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <p className="px-4 text-sm leading-6 text-white/75">{menuNote}</p>
                </SheetContent>
              </Sheet>
              <Link
                href="/"
                className="font-display text-[13px] tracking-[0.08em] whitespace-nowrap uppercase min-[360px]:text-[15px] min-[360px]:tracking-[0.12em] sm:text-[17px]"
              >
                WATCH OUT
              </Link>
            </div>

            <div className="flex items-center justify-end gap-1 lg:contents">
              <nav className="hidden items-center gap-5 lg:flex xl:gap-10" aria-label="Collections">
                {views.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={view === item.id ? "page" : undefined}
                    className={cn(
                      "font-serif text-[13px] font-semibold tracking-[0.12em] text-black uppercase xl:text-[15px] xl:tracking-[0.14em]",
                      view === item.id && "underline decoration-1 underline-offset-[8px]"
                    )}
                  >
                    {item.id}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-1 lg:justify-self-end lg:pr-8">
                <Dialog {...bind("search")}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={iconButtonClass}
                    aria-label="Search the collection"
                    onClick={() => setOverlay("search")}
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
                    <ul className="max-h-[min(18rem,35dvh)] space-y-1 overflow-auto">
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

                <Sheet {...bind("account")}>
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
                        onClick={() => toggleSaved(current.id)}
                      >
                        {saved.includes(current.id) ? "Remove this piece" : "Keep this piece"}
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

                <Sheet {...bind("cart")}>
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
                          onClick={() => addItem(current.id)}
                        >
                          Add {current.name}
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

          {children}

          <footer className="site-footer relative z-20 flex shrink-0 items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-9 sm:py-3 sm:pb-6">
            <div className="footer-socials flex shrink-0 items-center gap-1 sm:gap-4">
              {(["facebook", "instagram", "twitter"] as const).map((kind) => (
                <Button
                  key={kind}
                  variant="ghost"
                  size="icon"
                  className="size-8 text-black hover:bg-black/10 hover:text-black"
                  aria-label={kind}
                  onClick={() => setOverlay("studio")}
                >
                  <SocialIcon kind={kind} />
                </Button>
              ))}
            </div>
            <nav
              className="footer-nav flex min-w-0 justify-end gap-2 font-serif text-[11px] font-semibold tracking-[0.08em] text-black/80 uppercase sm:gap-4 sm:text-[14px] sm:tracking-[0.16em] lg:hidden"
              aria-label="Collections"
            >
              {(["men", "women", "jewellery"] as const).map((item) => (
                <Link
                  key={item}
                  href={viewHref[item]}
                  aria-current={view === item ? "page" : undefined}
                  className={cn(view === item && "underline decoration-1 underline-offset-4")}
                >
                  {item}
                </Link>
              ))}
            </nav>
            {onNext && (
              <button
                type="button"
                aria-label="Next piece"
                onClick={onNext}
                className="flex h-8 w-[18px] shrink-0 items-center justify-center rounded-full border border-black"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
              </button>
            )}
          </footer>

          <Dialog {...bind("studio")}>
            <DialogContent className="border-white/10 bg-[#1b201f] text-white sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-white">The studio</DialogTitle>
                <DialogDescription className="text-white/65">
                  WATCH OUT keeps a quiet bench in Lisbon. These are the channels the house actually uses.
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-2 text-sm">
                <li>Instagram · @watchout.atelier</li>
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
