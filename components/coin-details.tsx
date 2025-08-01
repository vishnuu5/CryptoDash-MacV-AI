"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, TrendingDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceChart } from "@/components/price-chart";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useWatchlist } from "@/contexts/watchlist-context";
import { fetchCoinDetails, fetchCoinChart } from "@/lib/api";
import { formatCurrency, formatPercentage, formatMarketCap } from "@/lib/utils";
import type { CoinDetail, ChartData } from "@/types/coin";

interface CoinDetailsProps {
  coinId: string;
}

export function CoinDetails({ coinId }: CoinDetailsProps) {
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<"1" | "7" | "30" | "90">("7");

  const { watchlist, addToWatchlist, removeFromWatchlist, isLoaded } =
    useWatchlist();
  const isInWatchlist = watchlist.includes(coinId);

  useEffect(() => {
    loadCoinDetails();
  }, [coinId]);

  useEffect(() => {
    if (coin) {
      loadChartData();
    }
  }, [coin, chartPeriod]);

  const loadCoinDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCoinDetails(coinId);
      setCoin(data);
    } catch (err) {
      setError("Failed to load coin details. Please try again.");
      console.error("Error loading coin details:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      setChartLoading(true);
      const data = await fetchCoinChart(coinId, chartPeriod);
      setChartData(data);
    } catch (err) {
      console.error("Error loading chart data:", err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !coin) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground text-center mb-4">
            {error || "Coin not found"}
          </p>
          <Link href="/">
            <Button>Back to Markets</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const priceChangeColor =
    coin.market_data.price_change_percentage_24h >= 0
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>
        <Button
          variant={isLoaded && isInWatchlist ? "default" : "outline"}
          onClick={handleWatchlistToggle}
          disabled={!isLoaded}
        >
          <Star
            className={`h-4 w-4 mr-2 ${
              isLoaded && isInWatchlist ? "fill-current" : ""
            }`}
          />
          {isLoaded && isInWatchlist
            ? "Remove from Watchlist"
            : "Add to Watchlist"}
        </Button>
      </div>

      {/* Coin Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-16 h-16">
              <Image
                src={coin.image.large || "/placeholder.svg?height=64&width=64"}
                alt={coin.name}
                fill
                className="rounded-full object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{coin.name}</h1>
              <p className="text-muted-foreground text-lg uppercase">
                {coin.symbol} • Rank #{coin.market_cap_rank}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Current Price
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(coin.market_data.current_price.usd)}
              </p>
              <p className={`text-sm font-medium ${priceChangeColor}`}>
                {formatPercentage(coin.market_data.price_change_percentage_24h)}{" "}
                (24h)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
              <p className="text-xl font-semibold">
                {formatMarketCap(coin.market_data.market_cap.usd)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
              <p className="text-xl font-semibold">
                {formatMarketCap(coin.market_data.total_volume.usd)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Price Chart</CardTitle>
            <Tabs
              value={chartPeriod}
              onValueChange={(value) =>
                setChartPeriod(value as typeof chartPeriod)
              }
            >
              <TabsList>
                <TabsTrigger value="1">24H</TabsTrigger>
                <TabsTrigger value="7">7D</TabsTrigger>
                <TabsTrigger value="30">30D</TabsTrigger>
                <TabsTrigger value="90">90D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <PriceChart data={chartData} loading={chartLoading} />
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap Rank</span>
              <span className="font-medium">#{coin.market_cap_rank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Circulating Supply</span>
              <span className="font-medium">
                {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Supply</span>
              <span className="font-medium">
                {coin.market_data.total_supply?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">All-Time High</span>
              <span className="font-medium">
                {formatCurrency(coin.market_data.ath.usd)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">All-Time Low</span>
              <span className="font-medium">
                {formatCurrency(coin.market_data.atl.usd)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About {coin.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  coin.description.en.slice(0, 500) +
                  (coin.description.en.length > 500 ? "..." : ""),
              }}
            />
            {coin.links.homepage[0] && (
              <div className="mt-4">
                <a
                  href={coin.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  Visit Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
