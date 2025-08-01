"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (coinId: string) => void;
  removeFromWatchlist: (coinId: string) => void;
  isLoaded: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side after hydration
    const loadWatchlist = () => {
      try {
        const saved = localStorage.getItem("crypto-watchlist");
        if (saved) {
          setWatchlist(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading watchlist from localStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadWatchlist();
  }, []);

  useEffect(() => {
    // Only save to localStorage after initial load
    if (isLoaded) {
      localStorage.setItem("crypto-watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = (coinId: string) => {
    setWatchlist((prev) => {
      if (!prev.includes(coinId)) {
        return [...prev, coinId];
      }
      return prev;
    });
  };

  const removeFromWatchlist = (coinId: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== coinId));
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isLoaded }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
