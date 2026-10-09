import { jewels, watches, type Collection } from "@/lib/catalog"

/** The three sections of the shop, each with its own page. */
export type View = Collection | "jewellery"

export const views: { id: View; label: string; href: string }[] = [
  { id: "men", label: "Men", href: "/watches/men" },
  { id: "women", label: "Women", href: "/watches/women" },
  { id: "jewellery", label: "Jewellery", href: "/jewellery" },
]

export const viewHref: Record<View, string> = {
  men: "/watches/men",
  women: "/watches/women",
  jewellery: "/jewellery",
}

/** Name of the query parameter that opens a specific piece on a collection page. */
export const PIECE_PARAM = "piece"

/** Page that shows a product, opened straight on that piece. */
export function productHref(id: string): string | null {
  const jewel = jewels.find((entry) => entry.id === id)
  if (jewel) return `${viewHref.jewellery}?${PIECE_PARAM}=${jewel.id}`
  const watch = watches.find((entry) => entry.id === id)
  if (watch) return `${viewHref[watch.collection]}?${PIECE_PARAM}=${watch.id}`
  return null
}

/** Reads `?piece=` from a page's `searchParams`. */
export function pieceFrom(params: { [key: string]: string | string[] | undefined }) {
  const value = params[PIECE_PARAM]
  return Array.isArray(value) ? value[0] : value
}
