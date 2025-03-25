"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command"

interface StockSearchResult {
  symbol: string
  name: string
}

export function SearchStocks() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<StockSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Mock data for demonstration
  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com, Inc." },
    { symbol: "TSLA", name: "Tesla, Inc." },
  ]

  const handleSearch = async (query: string) => {
    setSearch(query)

    if (!query || query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)

    try {
      // In a real app, you would call an API endpoint here
      // For now, we'll just filter the popular stocks
      const filteredResults = popularStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase()),
      )

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      setResults(filteredResults)
    } catch (error) {
      console.error("Error searching stocks:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (symbol: string) => {
    setOpen(false)
    router.push(`/stocks/${symbol}`)
  }

  return (
    <>
      <Button variant="outline" className="w-full md:w-auto relative" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4 mr-2" />
        <span>Search stocks...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for stocks..." value={search} onValueChange={handleSearch} />
        <CommandList>
          {loading && <CommandLoading>Searching stocks...</CommandLoading>}
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 ? (
            <CommandGroup heading="Search Results">
              {results.map((stock) => (
                <CommandItem key={stock.symbol} onSelect={() => handleSelect(stock.symbol)}>
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="ml-2 text-muted-foreground">{stock.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandGroup heading="Popular Stocks">
              {popularStocks.map((stock) => (
                <CommandItem key={stock.symbol} onSelect={() => handleSelect(stock.symbol)}>
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="ml-2 text-muted-foreground">{stock.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

