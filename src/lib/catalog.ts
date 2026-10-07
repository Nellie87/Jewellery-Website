export type Collection = "men" | "women"

export type Watch = {
  id: string
  collection: Collection
  code: string
  kicker: string
  lead: string
  trail: string
  lead2: string
  trail2: string
  blurb: string
  price: number
  material: string
  tone: string
  /** Pivot of the hands (the centre pin) in the 720x1280 photo, and how many photo pixels the close-up spans. */
  focus: { x: number; y: number; span: number }
}

export const watches: Watch[] = [
  {
    id: "men-super",
    collection: "men",
    code: "01",
    kicker: "Rose tourbillon",
    lead: "Watch",
    trail: "Future",
    lead2: "",
    trail2: "",
    blurb: "A rose-gold case around an open-worked tourbillon, on a textured black strap. Slimmer than the movement inside suggests.",
    price: 359,
    material: "Black rubber · rose gold case",
    tone: "#e7c2a8",
    focus: { x: 360, y: 555, span: 300 },
  },
  {
    id: "men-midnight",
    collection: "men",
    code: "02",
    kicker: "Night run",
    lead: "Midnight",
    trail: "Skeleton",
    lead2: "",
    trail2: "",
    blurb: "A blacked-out titanium case, electric-blue hands, and a movement you can read straight through.",
    price: 429,
    material: "Black rubber · black titanium case",
    tone: "#b7cbe2",
    focus: { x: 362, y: 558, span: 320 },
  },
  {
    id: "men-field",
    collection: "men",
    code: "03",
    kicker: "Field day",
    lead: "Olive",
    trail: "Field",
    lead2: "Open",
    trail2: "Heart",
    blurb: "A knurled steel bezel and an olive rubber strap, with the tourbillon on show in hard daylight.",
    price: 389,
    material: "Olive rubber · steel case",
    tone: "#c5d0b4",
    focus: { x: 359, y: 572, span: 320 },
  },
  {
    id: "men-evening",
    collection: "men",
    code: "04",
    kicker: "After hours",
    lead: "Graphite",
    trail: "Dress",
    lead2: "",
    trail2: "",
    blurb: "A graphite case, gold-toned bridges and brown alligator-grain leather for dinners and the walk home.",
    price: 519,
    material: "Brown leather · graphite case",
    tone: "#d4b59a",
    focus: { x: 359, y: 571, span: 300 },
  },
  {
    id: "women-rose",
    collection: "women",
    code: "01",
    kicker: "Rose hour",
    lead: "Petite",
    trail: "Rose",
    lead2: "",
    trail2: "",
    blurb: "A small rose-gold case with the movement on show, set on a soft blush strap.",
    price: 339,
    material: "Blush leather · rose gold case",
    tone: "#f0cfc6",
    focus: { x: 359, y: 580, span: 230 },
  },
  {
    id: "women-ivory",
    collection: "women",
    code: "02",
    kicker: "Ivory day",
    lead: "Ivory",
    trail: "Pavé",
    lead2: "",
    trail2: "",
    blurb: "A pavé-set bezel, a silver skeleton dial and a cream strap that sits well with linen or denim.",
    price: 499,
    material: "Ivory leather · white gold case",
    tone: "#efe8dc",
    focus: { x: 360, y: 552, span: 280 },
  },
  {
    id: "women-gilt",
    collection: "women",
    code: "03",
    kicker: "Golden hour",
    lead: "Gilded",
    trail: "Sport",
    lead2: "",
    trail2: "",
    blurb: "Warm yellow gold around an open tourbillon, on a tan strap made for long afternoons.",
    price: 449,
    material: "Tan leather · gold case",
    tone: "#e8c79a",
    focus: { x: 359, y: 576, span: 290 },
  },
  {
    id: "women-noir",
    collection: "women",
    code: "04",
    kicker: "Noir silk",
    lead: "Noir",
    trail: "Skeleton",
    lead2: "",
    trail2: "",
    blurb: "A small rose-gold case on textured black, with a dial that shows its workings and keeps the rest.",
    price: 379,
    material: "Black rubber · rose gold case",
    tone: "#d9b8a6",
    focus: { x: 361, y: 569, span: 250 },
  },
]

export function collectionOf(collection: Collection) {
  return watches.filter((watch) => watch.collection === collection)
}

export function watchImage(watch: Watch) {
  return `/watches/${watch.id}.webp`
}

export function watchName(watch: Watch) {
  return [watch.lead, watch.trail, watch.lead2, watch.trail2].filter(Boolean).join(" ")
}

export function formatPrice(price: number) {
  return `$ ${price}`
}

/* ------------------------------------------------------------------ */
/* Jewellery                                                           */
/* ------------------------------------------------------------------ */

export type Category = "watches" | "jewellery"

export type JewelKind = "necklace" | "earrings" | "ring"

export type Jewel = {
  id: string
  kind: JewelKind
  /** Label used in the navigation, e.g. "Necklace". */
  label: string
  name: string
  kicker: string
  blurb: string
  material: string
  price: number
  image: string
  width: number
  height: number
  /** Pearl centre in the photo, and how many photo pixels the round close-up spans. */
  focus: { x: number; y: number; span: number }
  /** Crops in from the bottom centre to trim baked-in text from the supplied photo. */
  zoom?: number
}

export type JewelleryEdit = {
  kicker: string
  title: string
  tagline: string
  /** Backdrop colour of the card while this edit is showing. */
  tone: string
  /** Pieces in display order (left to right). */
  pieces: Jewel[]
}

/** Pieces that come as a set are shown together, hung and posed on their plinths. */
export const jewelleryEdits: JewelleryEdit[] = [
  {
    kicker: "The Pearl Edit",
    title: "Pearls in Gold",
    tagline: "Quiet luxury, made to be remembered.",
    tone: "#cdbab6",
    pieces: [
      {
        id: "pearl-earrings",
        kind: "earrings",
        label: "Earrings",
        name: "Pearl Earrings",
        kicker: "Drop earrings",
        blurb: "Soft, uneven gold loops that each hold a single pearl drop. Light enough for every day.",
        material: "Gold vermeil · freshwater pearl",
        price: 179,
        image: "/jewellery/pearl-earrings.png",
        focus: { x: 263, y: 466, span: 260 },
        width: 736,
        height: 981,
      },
      {
        id: "pearl-pendant",
        kind: "necklace",
        label: "Necklace",
        name: "Gold Pearl Pendant",
        kicker: "Pendant necklace",
        blurb: "A single pearl resting in an open gold teardrop, hung from a fine chain.",
        material: "Gold chain · freshwater pearl",
        price: 299,
        image: "/jewellery/pearl-pendant.png",
        focus: { x: 358, y: 648, span: 230 },
        zoom: 1.55,
        width: 735,
        height: 919,
      },
      {
        id: "pearl-ring",
        kind: "ring",
        label: "Ring",
        name: "Gold Pearl Ring",
        kicker: "Cocktail ring",
        blurb: "A broad polished gold band with a round pearl set proud on top.",
        material: "Polished gold · freshwater pearl",
        price: 249,
        image: "/jewellery/pearl-ring.png",
        focus: { x: 405, y: 422, span: 250 },
        width: 736,
        height: 981,
      },
    ],
  },
]

export const jewels: Jewel[] = jewelleryEdits.flatMap((edit) => edit.pieces)

/** Anything that can go in the cart, saved list or search results. */
export type Product = {
  id: string
  category: Category
  name: string
  /** Second line: material or strap. */
  detail: string
  /** Searchable text. */
  keywords: string
  price: number
  /** Thumbnail image. */
  image: string
}

export const products: Product[] = [
  ...watches.map<Product>((watch) => ({
    id: watch.id,
    category: "watches",
    name: watchName(watch),
    detail: watch.material,
    keywords: [watchName(watch), watch.kicker, watch.blurb, watch.material, watch.collection, "watch"].join(" "),
    price: watch.price,
    image: watchImage(watch),
  })),
  ...jewels.map<Product>((jewel) => ({
    id: jewel.id,
    category: "jewellery",
    name: jewel.name,
    detail: jewel.material,
    keywords: [jewel.name, jewel.kicker, jewel.blurb, jewel.material, jewel.kind, jewel.label, "jewellery"].join(" "),
    price: jewel.price,
    image: jewel.image,
  })),
]

export function productById(id: string) {
  return products.find((product) => product.id === id)
}
