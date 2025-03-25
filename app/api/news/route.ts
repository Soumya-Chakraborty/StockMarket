import { NextResponse } from "next/server"
import { ALPHA_VANTAGE_BASE_URL, handleApiResponse, isApiKeyAvailable } from "@/lib/api"

// Types for Alpha Vantage API responses
interface NewsResponse {
  feed: NewsItem[]
  metadata: {
    count: number
    limit: number
    offset: number
  }
}

interface NewsItem {
  title: string
  url: string
  time_published: string
  authors: string[]
  summary: string
  banner_image?: string
  source: string
  category_within_source: string
  source_domain: string
  topics?: {
    topic: string
    relevance_score: string
  }[]
  overall_sentiment_score: number
  overall_sentiment_label: string
  ticker_sentiment?: {
    ticker: string
    relevance_score: string
    ticker_sentiment_score: string
    ticker_sentiment_label: string
  }[]
}

// Transformed news item
export interface TransformedNewsItem {
  id: number
  title: string
  source: string
  time: string
  url: string
  summary?: string
  image?: string
}

// Fallback data for when API is unavailable or rate limited
const fallbackGeneralNews = [
  {
    id: 1,
    title: "Fed Signals Potential Rate Cuts in Coming Months",
    source: "Financial Times",
    time: "2 hours ago",
    url: "#",
  },
  {
    id: 2,
    title: "Tech Stocks Rally as Inflation Concerns Ease",
    source: "Wall Street Journal",
    time: "4 hours ago",
    url: "#",
  },
  {
    id: 3,
    title: "Apple Announces New Product Line, Shares Jump 3%",
    source: "CNBC",
    time: "6 hours ago",
    url: "#",
  },
  {
    id: 4,
    title: "Oil Prices Fall Amid Global Supply Concerns",
    source: "Bloomberg",
    time: "8 hours ago",
    url: "#",
  },
]

// Function to format time difference
function formatTimeDifference(publishedTime: string): string {
  const published = new Date(publishedTime)
  const now = new Date()
  const diffMs = now.getTime() - published.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
  }

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
}

// Function to fetch news from Alpha Vantage
async function fetchNews(symbol?: string): Promise<TransformedNewsItem[]> {
  try {
    if (!isApiKeyAvailable()) {
      throw new Error("API key is not available")
    }

    let url: string
    if (symbol) {
      url = `${ALPHA_VANTAGE_BASE_URL}?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    } else {
      url = `${ALPHA_VANTAGE_BASE_URL}?function=NEWS_SENTIMENT&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    }

    const response = await fetch(url)
    const data = await handleApiResponse<NewsResponse>(response)

    // Check if we got valid data
    if (!data.feed || !Array.isArray(data.feed)) {
      throw new Error("Invalid news data format")
    }

    // Transform the data
    return data.feed.slice(0, 10).map((item, index) => ({
      id: index + 1,
      title: item.title,
      source: item.source,
      time: formatTimeDifference(item.time_published),
      url: item.url,
      summary: item.summary,
      image: item.banner_image,
    }))
  } catch (error) {
    console.error(`Error fetching news data:`, error)

    // Return fallback data
    if (symbol) {
      // Generate stock-specific news if a symbol is provided
      return [
        {
          id: 1,
          title: `${symbol} Reports Strong Quarterly Earnings, Beats Expectations`,
          source: "Financial Times",
          time: "2 hours ago",
          url: "#",
        },
        {
          id: 2,
          title: `Analysts Raise Price Target for ${symbol} Following Product Announcement`,
          source: "Wall Street Journal",
          time: "4 hours ago",
          url: "#",
        },
        {
          id: 3,
          title: `${symbol} Expands into New Markets, Shares Rally`,
          source: "CNBC",
          time: "6 hours ago",
          url: "#",
        },
        {
          id: 4,
          title: `Institutional Investors Increase Stakes in ${symbol}`,
          source: "Bloomberg",
          time: "8 hours ago",
          url: "#",
        },
      ]
    }

    return fallbackGeneralNews
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")

  try {
    const newsData = await fetchNews(symbol || undefined)
    return NextResponse.json(newsData)
  } catch (error) {
    console.error("Error in news API route:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch news data" }, { status: 500 })
  }
}

