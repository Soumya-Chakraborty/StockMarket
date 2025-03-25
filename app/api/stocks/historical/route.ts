import { NextResponse } from "next/server"
import { ALPHA_VANTAGE_BASE_URL, handleApiResponse, isApiKeyAvailable } from "@/lib/api"

// Types for Alpha Vantage API responses
interface TimeSeriesDaily {
  "Meta Data": {
    "1. Information": string
    "2. Symbol": string
    "3. Last Refreshed": string
    "4. Output Size": string
    "5. Time Zone": string
  }
  "Time Series (Daily)": {
    [date: string]: {
      "1. open": string
      "2. high": string
      "3. low": string
      "4. close": string
      "5. volume": string
    }
  }
}

interface TimeSeriesIntraday {
  "Meta Data": {
    "1. Information": string
    "2. Symbol": string
    "3. Last Refreshed": string
    "4. Interval": string
    "5. Output Size": string
    "6. Time Zone": string
  }
  [timeSeriesKey: string]: any
}

// Transformed historical data point
export interface HistoricalDataPoint {
  date: string
  value: number
}

// Generate mock data for demonstration
function generateMockData(symbol: string, timeframe: string, days: number): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  let baseValue =
    symbol === "AAPL"
      ? 180
      : symbol === "MSFT"
        ? 370
        : symbol === "GOOGL"
          ? 130
          : symbol === "AMZN"
            ? 150
            : symbol === "TSLA"
              ? 240
              : 200

  // Adjust volatility based on timeframe
  const volatility =
    timeframe === "1D"
      ? 0.005
      : timeframe === "1W"
        ? 0.01
        : timeframe === "1M"
          ? 0.02
          : timeframe === "3M"
            ? 0.03
            : timeframe === "1Y"
              ? 0.05
              : 0.07 // 5Y

  // Adjust trend based on symbol
  const trend = symbol === "AAPL" || symbol === "MSFT" ? 0.0005 : symbol === "TSLA" ? -0.0002 : 0.0001

  for (let i = 0; i < days; i++) {
    // More realistic market movement
    const dayOfWeek = i % 7
    // Weekend - no change for daily data
    if (timeframe !== "1D" && (dayOfWeek === 5 || dayOfWeek === 6)) {
      continue
    }

    // Weekday - market movement
    const randomFactor = (Math.random() - 0.5) * 2
    const change = baseValue * volatility * randomFactor + baseValue * trend
    baseValue += change

    const date = new Date()
    if (timeframe === "1D") {
      // For 1D, use hours
      date.setHours(date.getHours() - (days - i))
      data.push({
        date: date.toISOString(),
        value: Math.round(baseValue * 100) / 100,
      })
    } else {
      // For other timeframes, use days
      date.setDate(date.getDate() - (days - i))
      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(baseValue * 100) / 100,
      })
    }
  }

  return data
}

// Function to fetch historical data from Alpha Vantage
async function fetchHistoricalData(symbol: string, timeframe: string): Promise<HistoricalDataPoint[]> {
  try {
    if (!isApiKeyAvailable()) {
      throw new Error("API key is not available")
    }

    let url: string
    const outputSize = "compact" // compact returns the latest 100 data points

    // Determine the appropriate API function based on timeframe
    switch (timeframe) {
      case "1D":
        url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=${outputSize}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        break
      case "1W":
      case "1M":
        url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        break
      case "3M":
      case "1Y":
      case "5Y":
        url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        break
      default:
        url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    }

    const response = await fetch(url)
    const data = await handleApiResponse<TimeSeriesDaily | TimeSeriesIntraday>(response)

    // Transform the data based on timeframe
    const result: HistoricalDataPoint[] = []

    if (timeframe === "1D" && data["Time Series (5min)"]) {
      // Handle intraday data
      const timeSeries = data["Time Series (5min)"]
      const today = new Date().toISOString().split("T")[0]

      Object.entries(timeSeries)
        .filter(([timestamp]) => timestamp.startsWith(today))
        .forEach(([timestamp, values]) => {
          result.push({
            date: timestamp,
            value: Number.parseFloat(values["4. close"]),
          })
        })
    } else if (data["Time Series (Daily)"]) {
      // Handle daily data
      const timeSeries = data["Time Series (Daily)"]

      // Determine how many data points to include based on timeframe
      const daysToInclude =
        timeframe === "1W"
          ? 7
          : timeframe === "1M"
            ? 30
            : timeframe === "3M"
              ? 90
              : timeframe === "1Y"
                ? 365
                : timeframe === "5Y"
                  ? 1825
                  : 30 // Default to 1M

      let count = 0

      Object.entries(timeSeries)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .forEach(([date, values]) => {
          if (count < daysToInclude) {
            result.push({
              date,
              value: Number.parseFloat(values["4. close"]),
            })
            count++
          }
        })
    }

    return result
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error)

    // Return mock data as fallback
    console.log(`Using mock data for ${symbol} with timeframe ${timeframe}`)

    // Generate appropriate number of data points based on timeframe
    const days =
      timeframe === "1D"
        ? 24
        : timeframe === "1W"
          ? 7
          : timeframe === "1M"
            ? 30
            : timeframe === "3M"
              ? 90
              : timeframe === "1Y"
                ? 365
                : 1825 // 5Y

    return generateMockData(symbol, timeframe, days)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const timeframe = searchParams.get("timeframe") || "1M"

  if (!symbol) {
    return NextResponse.json({ error: "Symbol parameter is required" }, { status: 400 })
  }

  try {
    const historicalData = await fetchHistoricalData(symbol, timeframe)
    return NextResponse.json(historicalData)
  } catch (error) {
    console.error("Error in historical data API route:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch historical data" }, { status: 500 })
  }
}

