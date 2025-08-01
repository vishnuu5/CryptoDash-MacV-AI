import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = "https://api.coingecko.com/api/v3";
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

// Create axios instance with increased timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

if (COINGECKO_API_KEY) {
  api.defaults.headers.common["x-cg-demo-api-key"] = COINGECKO_API_KEY;
}

export async function GET(request: NextRequest) {
  if (!COINGECKO_API_KEY) {
    console.error("NEXT_PUBLIC_COINGECKO_API_KEY is not set.");
    return NextResponse.json(
      {
        error:
          "API key is missing. Please set NEXT_PUBLIC_COINGECKO_API_KEY environment variable.",
      },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const params = {
      vs_currency: searchParams.get("vs_currency") || "usd",
      order: searchParams.get("order") || "market_cap_desc",
      per_page: searchParams.get("per_page") || "50",
      page: searchParams.get("page") || "1",
      sparkline: searchParams.get("sparkline") || "false",
      price_change_percentage:
        searchParams.get("price_change_percentage") || "24h",
      ids: searchParams.get("ids") || undefined,
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    console.log("Fetching from CoinGecko with params:", cleanParams);

    const response = await api.get("/coins/markets", { params: cleanParams });

    console.log(`Successfully fetched ${response.data.length} coins`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching coins markets from CoinGecko:", error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return NextResponse.json(
          {
            error:
              "Request timeout - CoinGecko API is taking too long to respond.",
          },
          { status: 408 }
        );
      }
      if (error.response) {
        // If CoinGecko returns an HTML error page (e.g., for invalid API key or rate limit)
        if (
          typeof error.response.data === "string" &&
          error.response.data.startsWith("<!DOCTYPE html>")
        ) {
          console.error(
            "CoinGecko API returned HTML error page. This might indicate an invalid API key or rate limit."
          );
          return NextResponse.json(
            {
              error:
                "CoinGecko API returned an unexpected response. Check your API key or try again later.",
            },
            { status: error.response.status || 500 }
          );
        }
        if (error.response.status === 429) {
          return NextResponse.json(
            {
              error: "Rate limit exceeded. Please wait a moment and try again.",
            },
            { status: 429 }
          );
        }
        // For other HTTP errors from CoinGecko
        return NextResponse.json(
          {
            error: `CoinGecko API error: ${error.response.status} - ${
              error.response.statusText || "Unknown error"
            }`,
          },
          { status: error.response.status }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch cryptocurrency data." },
      { status: 500 }
    );
  }
}
