import { MarketsList } from "@/components/markets-list";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">CryptoDash</h1>
        <p className="text-muted-foreground text-lg">
          Track cryptocurrency prices and build your watchlist
        </p>
      </div>
      <MarketsList />
    </div>
  );
}
