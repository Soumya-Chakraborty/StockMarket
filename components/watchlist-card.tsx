"use client"

import Link from "next/link"
import { ArrowDown, ArrowUp, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WatchlistCard() {
  // Mock data for demonstration
  const watchlist = [
    {
      symbol: "AAPL",
      price: 187.68,
      change: 1.23,
      changePercent: 0.66,
    },
    {
      symbol: "MSFT",
      price: 378.85,
      change: 4.12,
      changePercent: 1.1,
    },
    {
      symbol: "TSLA",
      price: 239.29,
      change: -3.45,
      changePercent: -1.42,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>Stocks you're tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {watchlist.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
              <Link href={`/stocks/${stock.symbol}`} className="font-medium hover:underline">
                {stock.symbol}
              </Link>
              <div className="flex items-center gap-2">
                <div>${stock.price.toFixed(2)}</div>
                <div className={`flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {stock.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </CardFooter>
    </Card>
  )
}

