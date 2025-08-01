"use client"

import { useState, useEffect } from "react"
import { Star, TrendingDown, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CoinRow } from "@/components/coin-row"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { useWatchlist } from "@/contexts/watchlist-context"
import { fetchCoinsById } from "@/lib/api"
import type { Coin } from "@/types/coin"

export function WatchlistPage() {
  const { watchlist } = useWatchlist()
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (watchlist.length > 0) {
      loadWatchlistCoins()
    } else {
      setCoins([])
      setLoading(false)
    }
  }, [watchlist])

  const loadWatchlistCoins = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading watchlist coins:", watchlist)
      const data = await fetchCoinsById(watchlist)
      setCoins(data)
      console.log("Successfully loaded watchlist coins:", data.length)
    } catch (err) {
      console.error("Error loading watchlist:", err)
      if (err instanceof Error) {
        if (err.message.includes("timeout")) {
          setError("Request timed out. The API is taking too long to respond. Please try again.")
        } else if (err.message.includes("rate limit")) {
          setError("Rate limit exceeded. Please wait a moment and try again.")
        } else {
          setError("Failed to load watchlist data. Please try again.")
        }
      } else {
        setError("Failed to load watchlist data. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (watchlist.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground text-center mb-4">
            Start adding cryptocurrencies to your watchlist to track them here
          </p>
          <Button asChild>
            <a href="/">Browse Markets</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">{error}</p>
          <Button onClick={loadWatchlistCoins} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-medium text-muted-foreground">#</th>
                <th className="p-4 font-medium text-muted-foreground">Coin</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Price</th>
                <th className="p-4 font-medium text-muted-foreground text-right">24h %</th>
                <th className="p-4 font-medium text-muted-foreground text-right hidden sm:table-cell">Market Cap</th>
                <th className="p-4 font-medium text-muted-foreground text-right hidden md:table-cell">Volume (24h)</th>
                <th className="p-4 font-medium text-muted-foreground text-center">Watch</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <CoinRow key={coin.id} coin={coin} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
