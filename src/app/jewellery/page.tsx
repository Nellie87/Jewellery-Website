import type { Metadata } from "next"
import { JewelleryCollection } from "@/components/shop/jewellery-collection"
import { pieceFrom } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Jewellery — WATCH OUT",
  description: "The Pearl Edit: gold earrings, pendant and ring, each set with a freshwater pearl.",
}

export default async function JewelleryPage({ searchParams }: PageProps<"/jewellery">) {
  const piece = pieceFrom(await searchParams)
  return <JewelleryCollection key={piece ?? ""} piece={piece} />
}
