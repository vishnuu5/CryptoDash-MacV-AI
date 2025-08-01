import { WatchlistPage } from "@/components/watchlist-page";

export default function Watchlist() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">My Watchlist</h1>
        <p className="text-muted-foreground text-lg">
          Keep track of your favorite cryptocurrencies
        </p>
      </div>
      <WatchlistPage />
    </div>
  );
}
