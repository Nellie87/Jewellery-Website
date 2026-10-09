"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { useShop } from "@/components/shop/shop-provider"

/**
 * Index state for a row of pieces, plus every way of moving through it:
 * arrow keys, mouse wheel, touch swipe and mouse drag. All input is ignored
 * while a drawer is open or when `enabled` is false.
 */
export function useSlider(length: number, { initial = 0, enabled = true }: { initial?: number; enabled?: boolean } = {}) {
  const { overlay } = useShop()
  const [index, setIndex] = useState(initial)
  const dragX = useRef<number | null>(null)
  const wheelArmed = useRef(true)
  const wheelLock = useRef<number | null>(null)
  const blocked = overlay !== null || !enabled

  const step = (by: number) => setIndex((current) => (current + by + length) % length)

  useEffect(() => {
    if (blocked) return
    function onKey(event: KeyboardEvent) {
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % length)
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + length) % length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [blocked, length])

  useEffect(() => {
    if (blocked) return
    function onWheel(event: WheelEvent) {
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      let delta = event.deltaY
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight
      if (Math.abs(delta) < 8 || Math.abs(delta) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      if (wheelLock.current) window.clearTimeout(wheelLock.current)
      wheelLock.current = window.setTimeout(() => {
        wheelArmed.current = true
        wheelLock.current = null
      }, 280)
      if (!wheelArmed.current) return
      wheelArmed.current = false
      const direction = delta > 0 ? 1 : -1
      setIndex((current) => (current + direction + length) % length)
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", onWheel)
      if (wheelLock.current) window.clearTimeout(wheelLock.current)
      wheelLock.current = null
      wheelArmed.current = true
    }
  }, [blocked, length])

  // Touch screens never fire `wheel`, so a finger swipe (either axis) moves to the next/previous piece.
  useEffect(() => {
    if (blocked) return
    let start: { x: number; y: number; scrollable: boolean } | null = null

    function insideScroller(target: EventTarget | null) {
      let node = target instanceof Element ? target : null
      while (node && node !== document.body) {
        if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 1) {
          const overflowY = getComputedStyle(node).overflowY
          if (overflowY === "auto" || overflowY === "scroll") return true
        }
        node = node.parentElement
      }
      return false
    }

    function onStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        start = null
        return
      }
      const touch = event.touches[0]
      start = { x: touch.clientX, y: touch.clientY, scrollable: insideScroller(event.target) }
    }

    function onEnd(event: TouchEvent) {
      if (!start) return
      const touch = event.changedTouches[0]
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y
      const scrollable = start.scrollable
      start = null
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) < 48) return
        setIndex((current) => (current + (dx < 0 ? 1 : -1) + length) % length)
      } else {
        if (scrollable || Math.abs(dy) < 48) return
        setIndex((current) => (current + (dy < 0 ? 1 : -1) + length) % length)
      }
    }

    function onCancel() {
      start = null
    }

    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend", onEnd, { passive: true })
    window.addEventListener("touchcancel", onCancel, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend", onEnd)
      window.removeEventListener("touchcancel", onCancel)
    }
  }, [blocked, length])

  /** Spread on the element that should react to a mouse drag. */
  const dragProps = {
    onPointerDown: (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      dragX.current = event.clientX
    },
    onPointerUp: (event: PointerEvent) => {
      if (event.pointerType === "touch" || dragX.current == null) return
      const delta = event.clientX - dragX.current
      if (delta > 48) step(-1)
      if (delta < -48) step(1)
      dragX.current = null
    },
  }

  return { index, setIndex, next: () => step(1), prev: () => step(-1), dragProps }
}
