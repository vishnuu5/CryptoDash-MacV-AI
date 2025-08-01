import axios from "axios";
import type { Coin, CoinDetail, ChartData } from "@/types/coin";

// Create axios instance for our API routes with increased timeout
const api = axios.create({
  baseURL: "/api",
  timeout: 30000, // Increased to 30 seconds
  headers: {
    Accept: "application/json",
  },
});

// Add retry logic
const retryRequest = async (
  fn: () => Promise<any>,
  retries = 2
): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      console.log(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

export async function fetchCoinsMarkets(
  page = 1,
  perPage = 50
): Promise<Coin[]> {
  return retryRequest(async () => {
    try {
      const response = await api.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: perPage,
          page: page,
          sparkline: false,
          price_change_percentage: "24h",
        },
      });

      // Validate response data
      if (!response.data) {
        throw new Error("No data received from API");
      }

      if (!Array.isArray(response.data)) {
        console.error("API response is not an array:", response.data);
        throw new Error("Invalid data format received from API");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching coins markets:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch cryptocurrency data");
    }
  });
}

export async function fetchCoinDetails(coinId: string): Promise<CoinDetail> {
  return retryRequest(async () => {
    try {
      const response = await api.get(`/coins/${coinId}`);

      if (!response.data) {
        throw new Error("No data received from API");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching coin details:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch coin details");
    }
  });
}

export async function fetchCoinChart(
  coinId: string,
  days: string
): Promise<ChartData[]> {
  return retryRequest(async () => {
    try {
      const response = await api.get(`/coins/${coinId}/market_chart`, {
        params: {
          days: days,
        },
      });

      if (!response.data) {
        throw new Error("No data received from API");
      }

      if (!Array.isArray(response.data)) {
        console.error("Chart API response is not an array:", response.data);
        throw new Error("Invalid chart data format received from API");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching coin chart:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch chart data");
    }
  });
}

export async function fetchCoinsById(coinIds: string[]): Promise<Coin[]> {
  return retryRequest(async () => {
    try {
      const response = await api.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          ids: coinIds.join(","),
          order: "market_cap_desc",
          per_page: 250,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h",
        },
      });

      // Validate response data
      if (!response.data) {
        throw new Error("No data received from API");
      }

      if (!Array.isArray(response.data)) {
        console.error("Watchlist API response is not an array:", response.data);
        throw new Error("Invalid data format received from API");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching coins by ID:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch watchlist data");
    }
  });
}
