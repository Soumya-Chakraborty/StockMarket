"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Mock data for demonstration
const generateData = (days: number, trend: "up" | "down" | "volatile") => {
  const data = []
  let value = 4500

  for (let i = 0; i < days; i++) {
    let change

    if (trend === "up") {
      change = Math.random() * 50 - 10 // Mostly up
    } else if (trend === "down") {
      change = Math.random() * 50 - 40 // Mostly down
    } else {
      change = Math.random() * 80 - 40 // Volatile
    }

    value += change
    value = Math.max(value, 4000) // Ensure we don't go too low

    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
    })
  }

  return data
}

export function MarketChart() {
  const [timeframe, setTimeframe] = useState("1M")

  // Generate different data based on timeframe
  const getChartData = () => {
    switch (timeframe) {
      case "1D":
        return generateData(24, "volatile")
      case "1W":
        return generateData(7, "up")
      case "1M":
        return generateData(30, "up")
      case "3M":
        return generateData(90, "volatile")
      case "1Y":
        return generateData(365, "up")
      case "5Y":
        return generateData(365, "up")
      default:
        return generateData(30, "up")
    }
  }

  const data = getChartData()

  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "5Y"]

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
      </div>
      <div className="h-[250px]">
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
                if (timeframe === "1D") {
                  return value.split("T")[1]?.substring(0, 5) || value
                }
                if (timeframe === "1W" || timeframe === "1M") {
                  return value.split("-").slice(1).join("/")
                }
                return value.split("-").slice(1).join("/")
              }}
              className="text-xs"
            />
            <YAxis domain={["dataMin - 100", "dataMax + 100"]} className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2 border shadow-sm bg-background">
                      <div className="text-sm font-medium">{payload[0].payload.date}</div>
                      <div className="text-sm font-semibold">${payload[0].value}</div>
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

