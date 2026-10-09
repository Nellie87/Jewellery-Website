"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { productById, type Product } from "@/lib/catalog"

export type CartLine = { id: string; qty: number }

/** Drawers and dialogs. Only one can be open at a time. */
export type Overlay = "menu" | "search" | "cart" | "account" | "studio"

type ShopState = {
  cart: CartLine[]
  count: number
  subtotal: number
  saved: string[]
  savedProducts: Product[]
  order: string | null
  reserving: boolean
  added: boolean
  overlay: Overlay | null
  setOverlay: (overlay: Overlay | null) => void
  addItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  reserve: () => Promise<void>
  toggleSaved: (id: string) => void
}

const ShopContext = createContext<ShopState | null>(null)

export function useShop() {
  const value = useContext(ShopContext)
  if (!value) throw new Error("useShop must be used inside <ShopProvider>")
  return value
}

/**
 * Cart, saved list and open drawer. Mounted once in the root layout so they carry
 * over when you move between the men, women and jewellery pages.
 */
export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([])
  const [saved, setSaved] = useState<string[]>([])
  const [order, setOrder] = useState<string | null>(null)
  const [reserving, setReserving] = useState(false)
  const [added, setAdded] = useState(false)
  const [overlay, setOverlay] = useState<Overlay | null>(null)
  const addedTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (addedTimer.current) window.clearTimeout(addedTimer.current)
    },
    []
  )

  const addItem = useCallback((id: string) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === id)
      if (existing) {
        return current.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line))
      }
      return [...current, { id, qty: 1 }]
    })
    setOrder(null)
    setAdded(true)
    if (addedTimer.current) window.clearTimeout(addedTimer.current)
    addedTimer.current = window.setTimeout(() => setAdded(false), 1200)
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setCart((current) =>
      qty <= 0 ? current.filter((line) => line.id !== id) : current.map((line) => (line.id === id ? { ...line, qty } : line))
    )
  }, [])

  const reserve = useCallback(async () => {
    if (!cart.length || reserving) return
    setReserving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    setOrder(`SW-${String(Date.now()).slice(-6)}`)
    setCart([])
    setReserving(false)
  }, [cart.length, reserving])

  const toggleSaved = useCallback((id: string) => {
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }, [])

  const value = useMemo<ShopState>(() => {
    const count = cart.reduce((sum, line) => sum + line.qty, 0)
    const subtotal = cart.reduce((sum, line) => {
      const item = productById(line.id)
      return sum + (item ? item.price * line.qty : 0)
    }, 0)
    const savedProducts = saved.map((id) => productById(id)).filter((item): item is Product => Boolean(item))
    return {
      cart,
      count,
      subtotal,
      saved,
      savedProducts,
      order,
      reserving,
      added,
      overlay,
      setOverlay,
      addItem,
      setQty,
      reserve,
      toggleSaved,
    }
  }, [added, addItem, cart, order, overlay, reserve, reserving, saved, setQty, toggleSaved])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
