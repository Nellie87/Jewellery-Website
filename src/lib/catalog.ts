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
