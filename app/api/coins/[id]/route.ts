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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    console.log(`Fetching coin details for: ${id}`);

    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });

    console.log(`Successfully fetched details for ${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching coin details from CoinGecko:", error);

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
      { error: "Failed to fetch coin details." },
      { status: 500 }
    );
  }
}
