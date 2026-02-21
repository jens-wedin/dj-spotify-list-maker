import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "DJ Spotify List Maker",
  description: "Describe a vibe. Get a playlist. Save to Spotify.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${mono.variable} font-mono antialiased min-h-screen bg-booth-bg text-booth-text`}>
        <Providers>
          <header className="border-b border-booth-border px-6 py-4 flex items-center justify-between">
            <span className="text-booth-accent font-bold tracking-widest text-sm uppercase">
              DJ List Maker
            </span>
          </header>
          <main className="max-w-3xl mx-auto px-4 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
