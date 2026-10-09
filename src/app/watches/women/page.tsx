import type { Metadata } from "next"
import { WatchCollection } from "@/components/shop/watch-collection"
import { pieceFrom } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Women's watches — WATCH OUT",
  description: "Four small-case skeleton watches for women, in rose gold, white gold, yellow gold and black.",
}

export default async function WomenPage({ searchParams }: PageProps<"/watches/women">) {
  const piece = pieceFrom(await searchParams)
  return <WatchCollection key={piece ?? ""} collection="women" piece={piece} />
}
