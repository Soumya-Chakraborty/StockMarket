"use client"

import Link from "next/link"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PortfolioHoldings() {
  // Mock data for demonstration
  const holdings = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 15,
      avgCost: 150.25,
      currentPrice: 187.68,
      marketValue: 2815.2,
      gain: 561.45,
      gainPercent: 24.91,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      shares: 10,
      avgCost: 320.5,
      currentPrice: 378.85,
      marketValue: 3788.5,
      gain: 583.5,
      gainPercent: 18.2,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 8,
      avgCost: 120.75,
      currentPrice: 134.99,
      marketValue: 1079.92,
      gain: 113.92,
      gainPercent: 11.79,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com, Inc.",
      shares: 12,
      avgCost: 140.3,
      currentPrice: 153.42,
      marketValue: 1841.04,
      gain: 157.44,
      gainPercent: 9.35,
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      shares: 5,
      avgCost: 250.45,
      currentPrice: 239.29,
      marketValue: 1196.45,
      gain: -55.8,
      gainPercent: -4.46,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <CardDescription>Your current stock positions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right hidden md:table-cell">Avg Cost</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead className="text-right">Gain/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell>
                  <Link href={`/stocks/${holding.symbol}`} className="font-medium hover:underline">
                    {holding.symbol}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell">{holding.name}</TableCell>
                <TableCell className="text-right">{holding.shares}</TableCell>
                <TableCell className="text-right hidden md:table-cell">${holding.avgCost.toFixed(2)}</TableCell>
                <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">${holding.marketValue.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={`flex items-center justify-end ${holding.gain >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {holding.gain >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}$
                    {Math.abs(holding.gain).toFixed(2)} ({Math.abs(holding.gainPercent).toFixed(2)}%)
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

