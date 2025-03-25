"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PortfolioAllocation() {
  // Mock data for demonstration
  const sectorAllocation = [
    { name: "Technology", value: 45, color: "#2563eb" },
    { name: "Healthcare", value: 20, color: "#8b5cf6" },
    { name: "Finance", value: 15, color: "#ec4899" },
    { name: "Consumer", value: 10, color: "#f59e0b" },
    { name: "Energy", value: 10, color: "#10b981" },
  ]

  const stockAllocation = [
    { symbol: "AAPL", name: "Apple Inc.", value: 25, color: "#2563eb" },
    { symbol: "MSFT", name: "Microsoft Corporation", value: 20, color: "#8b5cf6" },
    { symbol: "GOOGL", name: "Alphabet Inc.", value: 15, color: "#ec4899" },
    { symbol: "AMZN", name: "Amazon.com, Inc.", value: 15, color: "#f59e0b" },
    { symbol: "TSLA", name: "Tesla, Inc.", value: 10, color: "#10b981" },
    { symbol: "Other", name: "Other Stocks", value: 15, color: "#6b7280" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sector Allocation</CardTitle>
          <CardDescription>Portfolio distribution by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sectorAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectorAllocation.map((sector) => (
                <TableRow key={sector.name}>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                    {sector.name}
                  </TableCell>
                  <TableCell className="text-right">{sector.value}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Stock Allocation</CardTitle>
          <CardDescription>Portfolio distribution by stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ symbol, percent }) => `${symbol} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stockAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockAllocation.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stock.color }} />
                    {stock.symbol}
                  </TableCell>
                  <TableCell className="text-right">{stock.value}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

