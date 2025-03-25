import { ArrowDown, ArrowUp, DollarSign, TrendingUp, Users, BarChart3, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockChart } from "@/components/stock-chart"
import { StockStats } from "@/components/stock-stats"
import { StockNews } from "@/components/stock-news"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isApiKeyAvailable } from "@/lib/api"

// This would normally be a server component that fetches data
// For demo purposes, we're using client components with useEffect
async function getStockData(symbol: string) {
  try {
    // Check if API key is available
    if (!isApiKeyAvailable()) {
      console.log("API key is not available, using fallback data")
      // Return fallback data
      return {
        symbol: symbol,
        name:
          symbol === "AAPL"
            ? "Apple Inc."
            : symbol === "MSFT"
              ? "Microsoft Corporation"
              : symbol === "GOOGL"
                ? "Alphabet Inc."
                : symbol === "AMZN"
                  ? "Amazon.com, Inc."
                  : symbol === "TSLA"
                    ? "Tesla, Inc."
                    : `${symbol} Corp.`,
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
      }
    }

    // Construct the full URL with the base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const apiUrl = `${baseUrl}/api/stocks?symbol=${symbol}`

    console.log(`Fetching stock data from: ${apiUrl}`)

    // Fetch stock data from API
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }, // Revalidate every minute
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API responded with status ${response.status}: ${errorText}`)
      throw new Error(`Failed to fetch stock data: ${response.status}`)
    }

    // Check if the response is empty
    const text = await response.text()
    if (!text || text.trim() === "") {
      console.error("Empty response received from API")
      throw new Error("Empty response from API")
    }

    try {
      // Try to parse the response as JSON
      const data = JSON.parse(text)
      return data
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
      console.error("Response text:", text)
      throw new Error("Invalid JSON response from API")
    }
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error)

    // Return fallback data for the specific symbol
    return {
      symbol: symbol,
      name:
        symbol === "AAPL"
          ? "Apple Inc."
          : symbol === "MSFT"
            ? "Microsoft Corporation"
            : symbol === "GOOGL"
              ? "Alphabet Inc."
              : symbol === "AMZN"
                ? "Amazon.com, Inc."
                : symbol === "TSLA"
                  ? "Tesla, Inc."
                  : `${symbol} Corp.`,
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
    }
  }
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params

  let stockData
  let error = null

  try {
    stockData = await getStockData(symbol)
  } catch (err) {
    error = err.message || "Failed to load stock data"
    // Provide fallback data
    stockData = {
      symbol: symbol,
      name: `${symbol}`,
      price: 0,
      change: 0,
      changePercent: 0,
      marketCap: "N/A",
      peRatio: "N/A",
      dividend: "N/A",
      volume: "N/A",
      avgVolume: "N/A",
      high: "N/A",
      low: "N/A",
      open: "N/A",
      prevClose: "N/A",
      fiftyTwoWeekHigh: "N/A",
      fiftyTwoWeekLow: "N/A",
    }
  }

  const isPositive = stockData.change >= 0

  return (
    <main className="container mx-auto p-4 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{stockData.symbol}</h1>
            <span className="text-xl text-muted-foreground">{stockData.name}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-semibold">${stockData.price.toFixed(2)}</span>
            <span className={`flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button>Buy</Button>
          <Button variant="outline">Add to Watchlist</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Market Cap</span>
              <span className="text-lg font-semibold">{stockData.marketCap}</span>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">P/E Ratio</span>
              <span className="text-lg font-semibold">{stockData.peRatio}</span>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Dividend Yield</span>
              <span className="text-lg font-semibold">{stockData.dividend}</span>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Volume</span>
              <span className="text-lg font-semibold">{stockData.volume}</span>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
          <CardDescription>Historical price data for {stockData.symbol}</CardDescription>
        </CardHeader>
        <CardContent>
          <StockChart symbol={stockData.symbol} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="stats">
            <TabsList>
              <TabsTrigger value="stats">Key Statistics</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-4">
              <StockStats stockData={stockData} />
            </TabsContent>
            <TabsContent value="news" className="mt-4">
              <StockNews symbol={stockData.symbol} />
            </TabsContent>
            <TabsContent value="financials" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    Financial data would be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Trade {stockData.symbol}</CardTitle>
              <CardDescription>Buy or sell shares of {stockData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="w-full">Buy</Button>
                  <Button variant="outline" className="w-full">
                    Sell
                  </Button>
                </div>
                <div className="border rounded-md p-4">
                  <p className="text-sm text-muted-foreground mb-2">Quick Trade</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Price:</span>
                      <span className="font-medium">${stockData.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Market Hours:</span>
                      <span className="font-medium">Open</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Order Type:</span>
                      <span className="font-medium">Market</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

