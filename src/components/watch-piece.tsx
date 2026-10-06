"use client"

import { useId } from "react"
import type { Dial, Metal } from "@/lib/catalog"
import { cn } from "@/lib/utils"

const metals: Record<Metal, [string, string, string, string]> = {
  graphite: ["#9aa1a6", "#3c4248", "#1a1d20", "#6a7278"],
  rose: ["#f3d2c6", "#c4897c", "#6e403c", "#e7b5a6"],
  gold: ["#fff0cc", "#d4b072", "#7a5a28", "#f0d7a4"],
  steel: ["#ffffff", "#b7c0c8", "#5c656e", "#e4e9ee"],
}

const dials: Record<
  Dial,
  { colors: string[]; glow: string; bottom: string[] }
> = {
  spectrum: {
    colors: ["#ff5a3c", "#ff9a2a", "#f2d14e", "#7adf6a", "#2ec8a0", "#3aa0ff", "#7a5cff", "#ff4d8d"],
    glow: "#1f8a45",
    bottom: ["#ff5a3c", "#f2c14e", "#3ddc97", "#3aa0ff"],
  },
  night: {
    colors: ["#7ec8ff", "#3aa0ff", "#6a6bff", "#b45cff", "#7ec8ff"],
    glow: "#1a4d8a",
    bottom: ["#3aa0ff", "#7a5cff", "#2ec8c0"],
  },
  field: {
    colors: ["#d7a441", "#e6c36a", "#8ea85a", "#c4b07a", "#d7a441"],
    glow: "#5c6b32",
    bottom: ["#c4a15a", "#8ea85a", "#e6c36a"],
  },
  blush: {
    colors: ["#f0b7ae", "#e7c2a4", "#f3d2c8", "#d9899a", "#f0b7ae"],
    glow: "#a85a62",
    bottom: ["#e7b7a8", "#f0d0b0", "#d9899a"],
  },
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const x0 = cx + r * Math.cos(rad(a0))
  const y0 = cy + r * Math.sin(rad(a0))
  const x1 = cx + r * Math.cos(rad(a1))
  const y1 = cy + r * Math.sin(rad(a1))
  const large = a1 - a0 > 180 ? 1 : 0
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`
}

export function WatchPiece({
  strap,
  strapLight,
  strapDeep,
  stitch,
  metal,
  dial,
  hour,
  minute,
  day,
  date,
  className,
}: {
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
  className?: string
}) {
  const uid = useId().replace(/:/g, "")
  const [light, mid, dark, highlight] = metals[metal]
  const face = dials[dial]
  const cx = 200
  const cy = 340

  const spectrumStart = 128
  const spectrumEnd = 412
  const steps = face.colors.length * 3

  return (
      <svg
        viewBox="0 0 400 680"
        className={cn(
          "h-full w-auto overflow-visible drop-shadow-[0_22px_28px_rgba(0,0,0,0.45)]",
          className
        )}
        aria-hidden
      >
        <defs>
          <linearGradient id={`${uid}-leather`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={strapDeep} />
            <stop offset="0.18" stopColor={strap} />
            <stop offset="0.48" stopColor={strapLight} />
            <stop offset="0.78" stopColor={strap} />
            <stop offset="1" stopColor={strapDeep} />
          </linearGradient>
          <radialGradient id={`${uid}-bezel`} cx="32%" cy="28%" r="75%">
            <stop offset="0%" stopColor={highlight} />
            <stop offset="26%" stopColor={light} />
            <stop offset="62%" stopColor={mid} />
            <stop offset="100%" stopColor={dark} />
          </radialGradient>
          <radialGradient id={`${uid}-glass`} cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </radialGradient>
          <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <rect x="154" y="36" width="92" height="608" rx="18" fill={`url(#${uid}-leather)`} />
        <rect x="164" y="48" width="72" height="584" rx="12" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="2.2 3.4" opacity="0.85" />
        <line x1="172" y1="56" x2="172" y2="624" stroke={stitch} strokeWidth="1" strokeDasharray="1.5 4" opacity="0.7" />
        <line x1="228" y1="56" x2="228" y2="624" stroke={stitch} strokeWidth="1" strokeDasharray="1.5 4" opacity="0.7" />

        <path d="M148 214 L126 248 L126 292 L274 292 L274 248 L252 214 Z" fill={`url(#${uid}-bezel)`} />
        <path d="M148 466 L126 432 L126 388 L274 388 L274 432 L252 466 Z" fill={`url(#${uid}-bezel)`} />

        <circle cx={cx} cy={cy} r="132" fill={`url(#${uid}-bezel)`} />
        <circle cx={cx} cy={cy} r="124" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.4" />
        <circle cx={cx} cy={cy} r="116" fill="#0c0e0d" />
        <circle cx={cx} cy={cy} r="108" fill="#070808" />

        <ellipse cx="168" cy="300" rx="46" ry="18" fill={face.glow} filter={`url(#${uid}-glow)`} opacity="0.85" />

        {Array.from({ length: steps }).map((_, i) => {
          const span = (spectrumEnd - spectrumStart) / steps
          const a0 = spectrumStart + i * span
          const a1 = a0 + span + 0.6
          const color = face.colors[i % face.colors.length]
          return (
            <path
              key={i}
              d={arcPath(cx, cy, 96, a0, a1)}
              fill="none"
              stroke={color}
              strokeWidth="7"
              strokeLinecap="butt"
            />
          )
        })}

        {face.bottom.map((color, i) => (
          <path
            key={color}
            d={arcPath(cx, cy, 78, 62 + i * 16, 76 + i * 16)}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}

        {[200, 214, 228].map((deg, i) => (
          <path
            key={deg}
            d={arcPath(cx, cy, 88, deg, deg + 8)}
            fill="none"
            stroke={["#7adf6a", "#3aa0ff", "#f2c14e"][i]}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}

        <circle cx={cx} cy={cy} r="108" fill={`url(#${uid}-glass)`} />

        <text
          x="168"
          y="356"
          textAnchor="end"
          fill="#ffffff"
          fontFamily="Outfit, sans-serif"
          fontSize="62"
          fontWeight="620"
        >
          {hour}
        </text>
        <text
          x="182"
          y="356"
          textAnchor="start"
          fill="#ffffff"
          fontFamily="Outfit, sans-serif"
          fontSize="50"
          fontWeight="560"
        >
          {minute}
        </text>
        <text x="252" y="332" fill="#d5d8d6" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="500">
          {day}
        </text>
        <text x="252" y="348" fill="#d5d8d6" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="500">
          {date}
        </text>
        <text
          x={cx}
          y="402"
          textAnchor="middle"
          fill="#eceeed"
          fontFamily="Outfit, sans-serif"
          fontSize="11"
          fontWeight="560"
          letterSpacing="2.4"
        >
          S&apos;WATCH
        </text>

        <rect x="328" y="312" width="18" height="40" rx="5" fill={`url(#${uid}-bezel)`} />
        <rect x="324" y="276" width="14" height="20" rx="3.5" fill={mid} />
        <rect x="324" y="372" width="14" height="22" rx="3.5" fill={mid} />
        <rect x="338" y="320" width="4" height="24" rx="1" fill="#ffffff" opacity="0.25" />
      </svg>
  )
}

export function MiniWatch({
  strap,
  metal,
}: {
  strap: string
  metal: Metal
}) {
  const caseColor =
    metal === "rose" ? "#c9897c" : metal === "gold" ? "#d4b072" : metal === "steel" ? "#c5ced6" : "#3c4248"

  return (
    <svg viewBox="0 0 40 64" className="h-14 w-9 shrink-0" aria-hidden>
      <rect x="12" y="2" width="16" height="60" rx="4" fill={strap} />
      <circle cx="20" cy="32" r="15" fill={caseColor} />
      <circle cx="20" cy="32" r="11" fill="#0c0e0d" />
      <text x="20" y="35" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Outfit, sans-serif">
        12
      </text>
    </svg>
  )
}
