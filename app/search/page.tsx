"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock search function
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data for demonstration
      const results = [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 187.68,
          change: 1.23,
          changePercent: 0.66,
          exchange: "NASDAQ",
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          price: 378.85,
          change: 4.12,
          changePercent: 1.1,
          exchange: "NASDAQ",
        },
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          price: 134.99,
          change: -0.87,
          changePercent: -0.64,
          exchange: "NASDAQ",
        },
        {
          symbol: "AMZN",
          name: "Amazon.com, Inc.",
          price: 153.42,
          change: 2.31,
          changePercent: 1.53,
          exchange: "NASDAQ",
        },
        {
          symbol: "TSLA",
          name: "Tesla, Inc.",
          price: 239.29,
          change: -3.45,
          changePercent: -1.42,
          exchange: "NASDAQ",
        },
      ].filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Stocks</h1>
        <p className="text-muted-foreground">Find stocks by symbol or company name</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Search</CardTitle>
          <CardDescription>Enter a stock symbol or company name to search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search for stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {searchResults.length} results for "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell>
                      <Link href={`/stocks/${stock.symbol}`} className="font-medium hover:underline">
                        {stock.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.exchange}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

