import { Card, CardContent } from "@/components/ui/card"

interface StockStatsProps {
  stockData: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    marketCap: string
    peRatio: string
    dividend: string
    volume: string
    avgVolume: string
    high: string
    low: string
    open: string
    prevClose: string
    fiftyTwoWeekHigh: string
    fiftyTwoWeekLow: string
  }
}

export function StockStats({ stockData }: StockStatsProps) {
  const stats = [
    { label: "Previous Close", value: stockData.prevClose },
    { label: "Open", value: stockData.open },
    { label: "Day's Range", value: `${stockData.low} - ${stockData.high}` },
    { label: "52 Week Range", value: `${stockData.fiftyTwoWeekLow} - ${stockData.fiftyTwoWeekHigh}` },
    { label: "Volume", value: stockData.volume },
    { label: "Avg. Volume", value: stockData.avgVolume },
    { label: "Market Cap", value: stockData.marketCap },
    { label: "P/E Ratio", value: stockData.peRatio },
    { label: "Dividend Yield", value: stockData.dividend },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

