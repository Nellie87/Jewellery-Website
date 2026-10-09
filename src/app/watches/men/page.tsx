import type { Metadata } from "next"
import { WatchCollection } from "@/components/shop/watch-collection"
import { pieceFrom } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Men's watches — WATCH OUT",
  description: "Four open-worked skeleton watches for men, from rose-gold tourbillon to graphite dress.",
}

export default async function MenPage({ searchParams }: PageProps<"/watches/men">) {
  const piece = pieceFrom(await searchParams)
  return <WatchCollection key={piece ?? ""} collection="men" piece={piece} />
}
