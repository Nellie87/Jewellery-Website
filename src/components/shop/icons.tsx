export function ScrollArrow({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d={
          direction === "up"
            ? "M2.5 7.5 6 4l3.5 3.5"
            : direction === "down"
              ? "M2.5 4.5 6 8l3.5-3.5"
              : direction === "left"
                ? "M7.5 2.5 4 6l3.5 3.5"
                : "M4.5 2.5 8 6 4.5 9.5"
        }
      />
    </svg>
  )
}

export function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" strokeLinecap="round" />
    </svg>
  )
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2c1.4-2.6 3.6-3.9 6.5-3.9s5.1 1.3 6.5 3.9" strokeLinecap="round" />
    </svg>
  )
}

export function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 7Z" />
      <path d="M8 7 9.2 4.8A1.5 1.5 0 0 1 10.5 4h3" strokeLinecap="round" />
      <circle cx="9" cy="19.5" r="1" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function SocialIcon({ kind }: { kind: "facebook" | "instagram" | "twitter" }) {
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M14.2 20v-7.1h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4H17V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.5v2.8H11.1V20h3.1Z" />
      </svg>
    )
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M19.6 7.4c-.6.3-1.2.4-1.9.5.7-.4 1.2-1.1 1.4-1.9-.6.4-1.4.7-2.1.9A3.3 3.3 0 0 0 12 9.7c0 .3 0 .5.1.8-2.7-.1-5.1-1.4-6.7-3.4-.3.5-.4 1-.4 1.6 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.3A6.6 6.6 0 0 1 4 17.6 9.3 9.3 0 0 0 9.1 19c5.1 0 7.9-4.2 7.9-7.9v-.4c.6-.4 1.1-.9 1.6-1.5-.5.2-1.1.4-1.7.5Z" />
    </svg>
  )
}
