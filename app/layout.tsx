import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { WatchlistProvider } from "@/contexts/watchlist-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoDash - Cryptocurrency Dashboard",
  description: "Track cryptocurrency prices, charts, and build your watchlist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <WatchlistProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </WatchlistProvider>
      </body>
    </html>
  );
}
