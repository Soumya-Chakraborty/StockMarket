"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Mock data for demonstration
const generatePerformanceData = (days: number) => {
  const data = []
  let value = 22000

  for (let i = 0; i < days; i++) {
    // More realistic market movement
    const dayOfWeek = i % 7
    // Weekend - no change
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))
      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(value * 100) / 100,
      })
      continue
    }

    // Weekday - market movement
    const change = (Math.random() - 0.48) * 300 // Slightly biased upward
    value += change
    value = Math.max(value, 20000) // Set a floor

    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
    })
  }

  return data
}

export function PortfolioPerformance() {
  const [timeframe, setTimeframe] = useState("1M")

  // Generate different data based on timeframe
  const getChartData = () => {
    switch (timeframe) {
      case "1W":
        return generatePerformanceData(7)
      case "1M":
        return generatePerformanceData(30)
      case "3M":
        return generatePerformanceData(90)
      case "1Y":
        return generatePerformanceData(365)
      case "YTD":
        const now = new Date()
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const daysSinceStartOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
        return generatePerformanceData(daysSinceStartOfYear)
      case "ALL":
        return generatePerformanceData(730) // 2 years
      default:
        return generatePerformanceData(30)
    }
  }

  const data = getChartData()

  const timeframes = ["1W", "1M", "3M", "YTD", "1Y", "ALL"]

  // Calculate performance metrics
  const firstValue = data[0]?.value || 0
  const lastValue = data[data.length - 1]?.value || 0
  const absoluteChange = lastValue - firstValue
  const percentageChange = (absoluteChange / firstValue) * 100
  const isPositive = absoluteChange >= 0

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
            >
              {tf}
            </Button>
          ))}
        </div>
        <div className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : "-"}${Math.abs(absoluteChange).toFixed(2)} ({Math.abs(percentageChange).toFixed(2)}%)
        </div>
      </div>
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
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                if (timeframe === "1W") {
                  return value.split("-").slice(1).join("/")
                }
                if (timeframe === "1M" || timeframe === "3M") {
                  return value.split("-").slice(1).join("/")
                }
                return value.split("-").slice(1).join("/")
              }}
              className="text-xs"
            />
            <YAxis
              domain={["dataMin - 500", "dataMax + 500"]}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              className="text-xs"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2 border shadow-sm bg-background">
                      <div className="text-sm font-medium">{payload[0].payload.date}</div>
                      <div className="text-sm font-semibold">${payload[0].value.toLocaleString()}</div>
                    </Card>
                  )
                }
                return null
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

