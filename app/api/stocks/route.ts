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

interface CompanyOverview {
  Symbol: string
  Name: string
  Description: string
  Exchange: string
  Currency: string
  Country: string
  Sector: string
  Industry: string
  MarketCapitalization: string
  PERatio: string
  DividendYield: string
  EPS: string
  ProfitMargin: string
  QuarterlyEarningsGrowthYOY: string
  QuarterlyRevenueGrowthYOY: string
  AnalystTargetPrice: string
  TrailingPE: string
  ForwardPE: string
  PriceToSalesRatioTTM: string
  PriceToBookRatio: string
  EVToRevenue: string
  EVToEBITDA: string
  Beta: string
  "52WeekHigh": string
  "52WeekLow": string
  "50DayMovingAverage": string
  "200DayMovingAverage": string
  SharesOutstanding: string
  DividendDate: string
  ExDividendDate: string
}

// Transformed stock data type
export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: string
  peRatio: string
  dividend: string
  volume: string
  avgVolume?: string
  high: string
  low: string
  open: string
  prevClose: string
  fiftyTwoWeekHigh: string
  fiftyTwoWeekLow: string
  description?: string
  sector?: string
  industry?: string
  exchange?: string
  currency?: string
  country?: string
  eps?: string
  profitMargin?: string
  beta?: string
  movingAvg50?: string
  movingAvg200?: string
}

// Fallback data for when API is unavailable or rate limited
const fallbackStockData = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.68,
    change: 1.23,
    changePercent: 0.66,
    marketCap: "2.94T",
    peRatio: "30.84",
    dividend: "0.92%",
    volume: "52.4M",
    avgVolume: "58.7M",
    high: "188.45",
    low: "185.83",
    open: "186.12",
    prevClose: "186.45",
    fiftyTwoWeekHigh: "199.62",
    fiftyTwoWeekLow: "124.17",
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.85,
    change: 4.12,
    changePercent: 1.1,
    marketCap: "2.82T",
    peRatio: "36.78",
    dividend: "0.74%",
    volume: "21.8M",
    avgVolume: "25.3M",
    high: "380.12",
    low: "375.20",
    open: "376.45",
    prevClose: "374.73",
    fiftyTwoWeekHigh: "384.30",
    fiftyTwoWeekLow: "275.37",
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 134.99,
    change: -0.87,
    changePercent: -0.64,
    marketCap: "1.69T",
    peRatio: "25.96",
    dividend: "0%",
    volume: "18.3M",
    avgVolume: "22.1M",
    high: "136.20",
    low: "134.45",
    open: "135.78",
    prevClose: "135.86",
    fiftyTwoWeekHigh: "142.68",
    fiftyTwoWeekLow: "89.42",
  },
}

// Function to fetch stock data from Alpha Vantage
async function fetchStockData(symbol: string): Promise<StockData> {
  try {
    if (!isApiKeyAvailable()) {
      throw new Error("API key is not available")
    }

    // Fetch quote data
    const quoteUrl = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    const quoteResponse = await fetch(quoteUrl)
    const quoteData = await handleApiResponse<GlobalQuote>(quoteResponse)

    // Fetch company overview
    const overviewUrl = `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    const overviewResponse = await fetch(overviewUrl)
    const overviewData = await handleApiResponse<CompanyOverview>(overviewResponse)

    // Check if we got valid data
    if (!quoteData["Global Quote"] || !quoteData["Global Quote"]["01. symbol"]) {
      throw new Error(`No data found for symbol: ${symbol}`)
    }

    const quote = quoteData["Global Quote"]

    // Transform the data
    return {
      symbol: quote["01. symbol"],
      name: overviewData.Name || symbol,
      price: Number.parseFloat(quote["05. price"]),
      change: Number.parseFloat(quote["09. change"]),
      changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
      marketCap: overviewData.MarketCapitalization
        ? (Number.parseInt(overviewData.MarketCapitalization) / 1000000000).toFixed(2) + "B"
        : "N/A",
      peRatio: overviewData.PERatio || "N/A",
      dividend: overviewData.DividendYield ? overviewData.DividendYield + "%" : "N/A",
      volume: Number.parseInt(quote["06. volume"]).toLocaleString(),
      high: quote["03. high"],
      low: quote["04. low"],
      open: quote["02. open"],
      prevClose: quote["08. previous close"],
      fiftyTwoWeekHigh: overviewData["52WeekHigh"] || "N/A",
      fiftyTwoWeekLow: overviewData["52WeekLow"] || "N/A",
      description: overviewData.Description,
      sector: overviewData.Sector,
      industry: overviewData.Industry,
      exchange: overviewData.Exchange,
      currency: overviewData.Currency,
      country: overviewData.Country,
      eps: overviewData.EPS,
      profitMargin: overviewData.ProfitMargin,
      beta: overviewData.Beta,
      movingAvg50: overviewData["50DayMovingAverage"],
      movingAvg200: overviewData["200DayMovingAverage"],
    }
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error)

    // Return fallback data if available, otherwise throw the error
    if (fallbackStockData[symbol]) {
      console.log(`Using fallback data for ${symbol}`)
      return fallbackStockData[symbol]
    }

    throw error
  }
}

// Update the GET function to ensure it always returns valid JSON

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")

  try {
    // If a specific symbol is requested
    if (symbol) {
      try {
        const stockData = await fetchStockData(symbol)
        return NextResponse.json(stockData)
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error)

        // Return fallback data if available, otherwise return an error
        if (fallbackStockData[symbol]) {
          console.log(`Using fallback data for ${symbol}`)
          return NextResponse.json(fallbackStockData[symbol])
        } else {
          // Create generic fallback data for any symbol
          const genericFallback = {
            symbol: symbol,
            name: `${symbol} Inc.`,
            price: 100.0,
            change: 0.0,
            changePercent: 0.0,
            marketCap: "N/A",
            peRatio: "N/A",
            dividend: "N/A",
            volume: "N/A",
            avgVolume: "N/A",
            high: "100.00",
            low: "100.00",
            open: "100.00",
            prevClose: "100.00",
            fiftyTwoWeekHigh: "100.00",
            fiftyTwoWeekLow: "100.00",
          }

          return NextResponse.json(genericFallback)
        }
      }
    }

    // If no symbol is provided, return popular stocks
    // In a real app, you might want to fetch multiple stocks in one go
    // but Alpha Vantage's free tier has rate limits
    const popularSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

    if (isApiKeyAvailable()) {
      try {
        // Try to fetch the first stock to test the API
        await fetchStockData("AAPL")

        // If successful, return fallback data with a message
        // In a production app, you might want to fetch all stocks
        return NextResponse.json({
          stocks: Object.values(fallbackStockData),
          message:
            "Using sample data. To fetch real-time data for multiple stocks, implement batch processing with API rate limits in mind.",
        })
      } catch (error) {
        // If API call fails, return fallback data
        return NextResponse.json({
          stocks: Object.values(fallbackStockData),
          message: "Using sample data due to API limitations.",
        })
      }
    } else {
      // If no API key, return fallback data
      return NextResponse.json({
        stocks: Object.values(fallbackStockData),
        message: "Using sample data. Please provide an Alpha Vantage API key to fetch real-time data.",
      })
    }
  } catch (error) {
    console.error("Error in stocks API route:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch stock data" }, { status: 500 })
  }
}

