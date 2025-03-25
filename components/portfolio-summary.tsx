"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

export function PortfolioSummary() {
  // Mock data for demonstration
  const portfolioValue = 25487.63
  const portfolioChange = 342.18
  const portfolioChangePercent = 1.36

  const portfolioAllocation = [
    { name: "Technology", value: 45 },
    { name: "Healthcare", value: 20 },
    { name: "Finance", value: 15 },
    { name: "Consumer", value: 10 },
    { name: "Energy", value: 10 },
  ]

  const COLORS = ["#2563eb", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Your investment summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
          <p className="text-sm text-green-500">
            +${portfolioChange.toFixed(2)} (+{portfolioChangePercent.toFixed(2)}%)
          </p>
        </div>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioAllocation}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="p-2 border shadow-sm bg-background">
                        <div className="text-sm font-medium">
                          {payload[0].name}: {payload[0].value}%
                        </div>
                      </Card>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {portfolioAllocation.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span>
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm">
          View Portfolio
        </Button>
      </CardFooter>
    </Card>
  )
}

