"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface HistoricalDataPoint {
  date: string
  value: number
}

export function StockChart({ symbol }: { symbol: string }) {
  const [timeframe, setTimeframe] = useState("1M")
  const [data, setData] = useState<HistoricalDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "5Y"]

  useEffect(() => {
    async function fetchHistoricalData() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/stocks/historical?symbol=${symbol}&timeframe=${timeframe}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to fetch data: ${response.status}`)
        }

        const historicalData = await response.json()
        setData(historicalData)
      } catch (err) {
        console.error("Error fetching historical data:", err)
        setError(err.message || "Failed to load chart data")
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [symbol, timeframe])

  // Calculate performance metrics if data is available
  const firstValue = data[0]?.value || 0
  const lastValue = data[data.length - 1]?.value || 0
  const absoluteChange = lastValue - firstValue
  const percentageChange = firstValue ? (absoluteChange / firstValue) * 100 : 0
  const isPositive = absoluteChange >= 0

  // Format date based on timeframe
  const formatDate = (dateStr: string) => {
    if (timeframe === "1D") {
      // For intraday data, show time
      const date = new Date(dateStr)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (timeframe === "1W" || timeframe === "1M") {
      // For shorter timeframes, show month/day
      const date = new Date(dateStr)
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    } else {
      // For longer timeframes, show month/year
      const date = new Date(dateStr)
      return date.toLocaleDateString([], { month: "short", year: "2-digit" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              disabled={loading}
            >
              {tf}
            </Button>
          ))}
        </div>
        {!loading && !error && data.length > 0 && (
          <div className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : "-"}${Math.abs(absoluteChange).toFixed(2)} ({Math.abs(percentageChange).toFixed(2)}%)
          </div>
        )}
      </div>

      {loading && (
        <div className="h-[350px] flex items-center justify-center">
          <div className="space-y-2 w-full">
            <Skeleton className="h-[350px] w-full" />
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
              <YAxis domain={["dataMin - 10", "dataMax + 10"]} className="text-xs" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="p-2 border shadow-sm bg-background">
                        <div className="text-sm font-medium">{formatDate(payload[0].payload.date)}</div>
                        <div className="text-sm font-semibold">${payload[0].value.toFixed(2)}</div>
                      </Card>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No historical data available</p>
        </div>
      )}
    </div>
  )
}

