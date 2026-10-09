import {
  jewelleryEdits,
  watchImage,
  watchName,
  type Jewel,
  type JewelleryEdit,
  type Watch,
} from "@/lib/catalog"

/** One slide, whether it is a watch or a piece of jewellery. */
export type Shown = {
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

export function showWatch(item: Watch): Shown {
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

export function showJewel(item: Jewel, position: number, edit: JewelleryEdit): Shown {
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

export const pearlEdit = jewelleryEdits[0]
