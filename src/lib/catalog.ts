export type Collection = "men" | "women"
export type Metal = "graphite" | "rose" | "gold" | "steel"
export type Dial = "spectrum" | "night" | "field" | "blush"

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
  strap: string
  strapLight: string
  strapDeep: string
  stitch: string
  metal: Metal
  dial: Dial
  hour: string
  minute: string
  day: string
  date: string
}

export const watches: Watch[] = [
  {
    id: "men-super",
    collection: "men",
    code: "01",
    kicker: "Smart watch",
    lead: "Super",
    trail: "Luxury",
    lead2: "Super",
    trail2: "Watches",
    blurb: "Caramel leather on a matte case. Clear at noon, quiet enough for a late room.",
    price: 359,
    material: "Caramel leather · graphite case",
    strap: "#c56b43",
    strapLight: "#d98960",
    strapDeep: "#8a4328",
    stitch: "#6d381f",
    metal: "graphite",
    dial: "spectrum",
    hour: "12",
    minute: "38",
    day: "WED",
    date: "8/7",
  },
  {
    id: "men-midnight",
    collection: "men",
    code: "02",
    kicker: "Night run",
    lead: "Midnight",
    trail: "Steel",
    lead2: "Sport",
    trail2: "Chrono",
    blurb: "A black strap and a colder dial for runs that start before the streetlights die.",
    price: 429,
    material: "Black leather · steel case",
    strap: "#2a2c2e",
    strapLight: "#3d4044",
    strapDeep: "#121314",
    stitch: "#5c6166",
    metal: "steel",
    dial: "night",
    hour: "05",
    minute: "16",
    day: "THU",
    date: "9/2",
  },
  {
    id: "men-field",
    collection: "men",
    code: "03",
    kicker: "Field day",
    lead: "Olive",
    trail: "Field",
    lead2: "Day",
    trail2: "Tracker",
    blurb: "An olive strap, a tougher bezel, and a face that stays honest in hard daylight.",
    price: 389,
    material: "Olive leather · graphite case",
    strap: "#6d7a4e",
    strapLight: "#8b9868",
    strapDeep: "#3c4628",
    stitch: "#2a331c",
    metal: "graphite",
    dial: "field",
    hour: "09",
    minute: "41",
    day: "SAT",
    date: "4/12",
  },
  {
    id: "men-evening",
    collection: "men",
    code: "04",
    kicker: "After hours",
    lead: "Graphite",
    trail: "Dress",
    lead2: "After",
    trail2: "Dark",
    blurb: "Slimmer lugs and a darker strap for dinners, delays, and the walk home after.",
    price: 519,
    material: "Dark brown leather · graphite case",
    strap: "#4a3428",
    strapLight: "#6b4b38",
    strapDeep: "#241812",
    stitch: "#1a100c",
    metal: "graphite",
    dial: "night",
    hour: "20",
    minute: "05",
    day: "FRI",
    date: "11/8",
  },
  {
    id: "women-rose",
    collection: "women",
    code: "01",
    kicker: "Rose hour",
    lead: "Petite",
    trail: "Rose",
    lead2: "Soft",
    trail2: "Hours",
    blurb: "A blush strap and a rose case, cut closer to the wrist without losing the face.",
    price: 339,
    material: "Blush leather · rose case",
    strap: "#e7b7a8",
    strapLight: "#f3d4c8",
    strapDeep: "#c48474",
    stitch: "#a86b62",
    metal: "rose",
    dial: "blush",
    hour: "10",
    minute: "22",
    day: "MON",
    date: "3/4",
  },
  {
    id: "women-ivory",
    collection: "women",
    code: "02",
    kicker: "Ivory day",
    lead: "Ivory",
    trail: "Day",
    lead2: "Light",
    trail2: "Face",
    blurb: "Cream leather and a pale dial that looks clean with linen, denim, or nothing else.",
    price: 299,
    material: "Ivory leather · steel case",
    strap: "#efe4d2",
    strapLight: "#f7f1e6",
    strapDeep: "#c9bba6",
    stitch: "#b7a890",
    metal: "steel",
    dial: "field",
    hour: "08",
    minute: "04",
    day: "TUE",
    date: "5/19",
  },
  {
    id: "women-gilt",
    collection: "women",
    code: "03",
    kicker: "Golden hour",
    lead: "Gilded",
    trail: "Sport",
    lead2: "Golden",
    trail2: "Hour",
    blurb: "A warm gold bezel and a tan strap, built for long afternoons that refuse to end.",
    price: 449,
    material: "Tan leather · gold case",
    strap: "#c99762",
    strapLight: "#e0b683",
    strapDeep: "#8d6436",
    stitch: "#6b4a28",
    metal: "gold",
    dial: "field",
    hour: "16",
    minute: "48",
    day: "SUN",
    date: "6/21",
  },
  {
    id: "women-noir",
    collection: "women",
    code: "04",
    kicker: "Noir silk",
    lead: "Noir",
    trail: "Silk",
    lead2: "Night",
    trail2: "Face",
    blurb: "Black leather, a smaller case, and a dial that only shows what the hour needs.",
    price: 379,
    material: "Black leather · rose case",
    strap: "#232326",
    strapLight: "#3a3a40",
    strapDeep: "#101012",
    stitch: "#6a6a72",
    metal: "rose",
    dial: "night",
    hour: "23",
    minute: "11",
    day: "SAT",
    date: "12/6",
  },
]

export function collectionOf(collection: Collection) {
  return watches.filter((watch) => watch.collection === collection)
}

export function watchName(watch: Watch) {
  return `${watch.lead} ${watch.trail} ${watch.lead2} ${watch.trail2}`
}

export function formatPrice(price: number) {
  return `$ ${price}`
}
