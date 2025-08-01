"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoinRow } from "@/components/coin-row";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchCoinsMarkets } from "@/lib/api";
import type { Coin } from "@/types/coin";

const COINS_PER_PAGE = 50;

export function MarketsList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "market_cap" | "price_change_percentage_24h" | "total_volume"
  >("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadCoins();
  }, [currentPage]);

  const loadCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Loading coins for page ${currentPage}`);

      const data = await fetchCoinsMarkets(currentPage, COINS_PER_PAGE);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setCoins(data);
        console.log(`Successfully loaded ${data.length} coins`);
      } else {
        console.error("API returned non-array data:", data);
        setError("Invalid data format received from API");
        setCoins([]);
      }
    } catch (err) {
      console.error("Error loading coins:", err);
      setCoins([]); // Ensure coins is always an array

      if (err instanceof Error) {
        if (err.message.includes("timeout")) {
          setError("Request timed out. Please try again.");
        } else if (err.message.includes("rate limit")) {
          setError("Rate limit exceeded. Please wait a moment and try again.");
        } else {
          setError("Failed to load cryptocurrency data. Please try again.");
        }
      } else {
        setError("Failed to load cryptocurrency data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedCoins = useMemo(() => {
    // Ensure coins is always an array before filtering
    if (!Array.isArray(coins)) {
      console.warn("Coins is not an array:", coins);
      return [];
    }

    const filtered = coins.filter(
      (coin) =>
        coin &&
        coin.name &&
        coin.symbol &&
        (coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [coins, debouncedSearchTerm, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field as typeof sortBy);
    setSortOrder(order as typeof sortOrder);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            {error}
          </p>
          <Button onClick={loadCoins}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Cryptocurrency Markets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market_cap-desc">
                  Market Cap (High to Low)
                </SelectItem>
                <SelectItem value="market_cap-asc">
                  Market Cap (Low to High)
                </SelectItem>
                <SelectItem value="price_change_percentage_24h-desc">
                  24h Change (High to Low)
                </SelectItem>
                <SelectItem value="price_change_percentage_24h-asc">
                  24h Change (Low to High)
                </SelectItem>
                <SelectItem value="total_volume-desc">
                  Volume (High to Low)
                </SelectItem>
                <SelectItem value="total_volume-asc">
                  Volume (Low to High)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coins Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredAndSortedCoins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No cryptocurrencies found
              </h3>
              <p className="text-muted-foreground text-center">
                {coins.length === 0
                  ? "No data available"
                  : "Try adjusting your search terms or filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-muted-foreground">#</th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Coin
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-right">
                      Price
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-right">
                      24h %
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-right hidden sm:table-cell">
                      Market Cap
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-right hidden md:table-cell">
                      Volume (24h)
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-center">
                      Watch
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedCoins.map((coin) => (
                    <CoinRow key={coin.id} coin={coin} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && filteredAndSortedCoins.length > 0 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={filteredAndSortedCoins.length < COINS_PER_PAGE}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
