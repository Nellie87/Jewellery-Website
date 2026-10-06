import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "S'WATCH — Super Luxury Watches",
  description:
    "A small watch house in Lisbon. Caramel leather, graphite cases, and four pieces a season.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="h-dvh overflow-hidden bg-[#c19a78] font-sans text-white">{children}</body>
    </html>
  );
}
