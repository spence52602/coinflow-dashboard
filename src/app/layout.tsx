/**
 * Root layout — the document shell every route renders inside.
 *
 * This is the only place the two licensed local faces are registered with
 * next/font, so they are self-hosted and preloaded rather than fetched at
 * runtime. Nothing else in the app declares a font.
 */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MobileNotice } from "@/components/MobileNotice";

const swift = localFont({
  src: [
    { path: "../fonts/swift-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/swift-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-swift",
  display: "block",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const acid = localFont({
  src: [
    { path: "../fonts/acid-grotesk-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/acid-grotesk-medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-acid",
  display: "block",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Coinflow — Merchant Home",
  description: "Coinflow merchant dashboard",
  /* The one intentional color literal outside tokens.css: this favicon is a
     data-URI SVG the browser renders in its own chrome, detached from the
     document, so custom properties have nothing to resolve against. It is an
     icon asset rather than UI, and its black is --ink by value. */
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path d="M20.6 6.4A9 9 0 1 0 20.6 19.6" stroke="#000" stroke-width="2.6" fill="none" stroke-linecap="square"/><path d="M12.4 13c2.6-3.1 5.2-3.1 7.8 0" stroke="#000" stroke-width="2.6" fill="none" stroke-linecap="square"/></svg>',
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${swift.variable} ${acid.variable}`}>
      <body>
        {/* Below sm the dashboard is blurred behind MobileNotice. The blur sits
            on the content rather than on the note's backdrop: `backdrop-filter`
            is a compositor effect that some engines decline to paint, and the
            product must not be readable through the note when that happens.
            Making this element the containing block for fixed descendants is
            safe here — the sidebar is static below lg, and Radix portals mount
            on <body>, outside this wrapper. */}
        <div className="max-sm:pointer-events-none max-sm:blur-[14px]">
          {children}
        </div>
        <MobileNotice />
      </body>
    </html>
  );
}
