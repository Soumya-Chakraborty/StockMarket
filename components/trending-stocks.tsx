"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowDown, ArrowUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
}

export function TrendingStocks() {
  const [trendingStocks, setTrendingStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrendingStocks() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/stocks")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to fetch data: ${response.status}`)
        }

        const data = await response.json()

        if (data.stocks) {
          setTrendingStocks(data.stocks)
        } else if (Array.isArray(data)) {
          setTrendingStocks(data)
        } else if (data.message) {
          console.log("API Message:", data.message)
          setTrendingStocks([])
        }
      } catch (err) {
        console.error("Error fetching trending stocks:", err)
        setError(err.message || "Failed to load trending stocks")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingStocks()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending Stocks</CardTitle>
        <CardDescription>Most active stocks in the market today</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : trendingStocks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="hidden md:table-cell">Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right hidden md:table-cell">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingStocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell>
                    <Link href={`/stocks/${stock.symbol}`} className="font-medium hover:underline">
                      {stock.symbol}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{stock.name}</TableCell>
                  <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div
                      className={`flex items-center justify-end ${
                        stock.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">{stock.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">No trending stocks available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

