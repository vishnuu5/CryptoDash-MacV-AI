"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/contexts/watchlist-context";
import { formatCurrency, formatPercentage, formatMarketCap } from "@/lib/utils";
import type { Coin } from "@/types/coin";

interface CoinRowProps {
  coin: Coin;
}

export function CoinRow({ coin }: CoinRowProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist, isLoaded } =
    useWatchlist();
  const isInWatchlist = watchlist.includes(coin.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWatchlist) {
      removeFromWatchlist(coin.id);
    } else {
      addToWatchlist(coin.id);
    }
  };

  const priceChangeColor =
    coin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600";

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-4 text-muted-foreground">{coin.market_cap_rank}</td>
      <td className="p-4">
        <Link
          href={`/coin/${coin.id}`}
          className="flex items-center space-x-3 hover:opacity-80"
        >
          <div className="relative w-8 h-8">
            <Image
              src={coin.image || "/placeholder.svg?height=32&width=32"}
              alt={coin.name}
              fill
              className="rounded-full object-cover"
              sizes="32px"
            />
          </div>
          <div>
            <div className="font-medium">{coin.name}</div>
            <div className="text-sm text-muted-foreground uppercase">
              {coin.symbol}
            </div>
          </div>
        </Link>
      </td>
      <td className="p-4 text-right font-medium">
        {formatCurrency(coin.current_price)}
      </td>
      <td className={`p-4 text-right font-medium ${priceChangeColor}`}>
        {formatPercentage(coin.price_change_percentage_24h)}
      </td>
      <td className="p-4 text-right text-muted-foreground hidden sm:table-cell">
        {formatMarketCap(coin.market_cap)}
      </td>
      <td className="p-4 text-right text-muted-foreground hidden md:table-cell">
        {formatMarketCap(coin.total_volume)}
      </td>
      <td className="p-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWatchlistToggle}
          className="h-8 w-8 p-0"
          disabled={!isLoaded}
        >
          <Star
            className={`h-4 w-4 ${
              isLoaded && isInWatchlist
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      </td>
    </tr>
  );
}
