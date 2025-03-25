import { NextResponse } from "next/server"
import { ALPHA_VANTAGE_BASE_URL, handleApiResponse, isApiKeyAvailable } from "@/lib/api"

// Types for Alpha Vantage API responses
interface GlobalQuote {
  "Global Quote": {
    "01. symbol": string
    "02. open": string
    "03. high": string
    "04. low": string
    "05. price": string
    "06. volume": string
    "07. latest trading day": string
    "08. previous close": string
    "09. change": string
    "10. change percent": string
  }
}

// Market index data
interface MarketIndex {
  name: string
  symbol: string
  value: string
  change: string
  isPositive: boolean
}

// Fallback data for when API is unavailable or rate limited
const fallbackMarketIndices = [
  {
    name: "S&P 500",
    symbol: "SPY",
    value: "4,587.64",
    change: "+0.57%",
    isPositive: true,
  },
  {
    name: "Dow Jones",
    symbol: "DIA",
    value: "37,306.02",
    change: "+0.86%",
    isPositive: true,
  },
  {
    name: "Nasdaq",
    symbol: "QQQ",
    value: "14,403.97",
    change: "-0.23%",
    isPositive: false,
  },
  {
    name: "Russell 2000",
    symbol: "IWM",
    value: "1,920.87",
    change: "+0.41%",
    isPositive: true,
  },
]

// Function to fetch market index data from Alpha Vantage
async function fetchMarketIndex(symbol: string, name: string): Promise<MarketIndex> {
  try {
    if (!isApiKeyAvailable()) {
      throw new Error("API key is not available")
    }

    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    const response = await fetch(url)
    const data = await handleApiResponse<GlobalQuote>(response)

    // Check if we got valid data
    if (!data["Global Quote"] || !data["Global Quote"]["01. symbol"]) {
      throw new Error(`No data found for symbol: ${symbol}`)
    }

    const quote = data["Global Quote"]
    const changePercent = quote["10. change percent"].replace("%", "").trim()
    const isPositive = Number.parseFloat(changePercent) >= 0

    return {
      name,
      symbol,
      value: Number.parseFloat(quote["05. price"]).toLocaleString(),
      change: `${isPositive ? "+" : ""}${changePercent}%`,
      isPositive,
    }
  } catch (error) {
    console.error(`Error fetching market index data for ${symbol}:`, error)

    // Return fallback data
    const fallbackIndex = fallbackMarketIndices.find((index) => index.symbol === symbol)
    if (fallbackIndex) {
      return fallbackIndex
    }

    // If no fallback data for this specific symbol, create a generic one
    return {
      name,
      symbol,
      value: "N/A",
      change: "N/A",
      isPositive: true,
    }
  }
}

export async function GET() {
  try {
    if (isApiKeyAvailable()) {
      // Define the market indices to fetch
      const indicesToFetch = [
        { symbol: "SPY", name: "S&P 500" },
        { symbol: "DIA", name: "Dow Jones" },
        { symbol: "QQQ", name: "Nasdaq" },
        { symbol: "IWM", name: "Russell 2000" },
      ]

      try {
        // Fetch the first index to test the API
        await fetchMarketIndex("SPY", "S&P 500")

        // If successful, return fallback data with a message
        // In a production app, you might want to fetch all indices
        return NextResponse.json({
          indices: fallbackMarketIndices,
          message:
            "Using sample data. To fetch real-time market indices, implement batch processing with API rate limits in mind.",
        })
      } catch (error) {
        // If API call fails, return fallback data
        return NextResponse.json({
          indices: fallbackMarketIndices,
          message: "Using sample data due to API limitations.",
        })
      }
    } else {
      // If no API key, return fallback data
      return NextResponse.json({
        indices: fallbackMarketIndices,
        message: "Using sample data. Please provide an Alpha Vantage API key to fetch real-time data.",
      })
    }
  } catch (error) {
    console.error("Error in market API route:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch market data" }, { status: 500 })
  }
}

