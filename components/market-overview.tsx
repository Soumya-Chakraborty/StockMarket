"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, AlertCircle } from "lucide-react"
import { MarketChart } from "@/components/market-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MarketIndex {
  name: string
  symbol: string
  value: string
  change: string
  isPositive: boolean
}

export function MarketOverview() {
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/market")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to fetch data: ${response.status}`)
        }

        const data = await response.json()

        if (data.indices) {
          setMarketIndices(data.indices)
        } else if (data.message) {
          console.log("API Message:", data.message)
          setMarketIndices([])
        }
      } catch (err) {
        console.error("Error fetching market data:", err)
        setError(err.message || "Failed to load market data")
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Track major market indices and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="indices">
          <TabsList className="mb-4">
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="futures">Futures</TabsTrigger>
          </TabsList>
          <TabsContent value="indices" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marketIndices.map((index) => (
                  <Card key={index.name}>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">{index.name}</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-semibold">{index.value}</p>
                          <div
                            className={`flex items-center text-sm ${
                              index.isPositive ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {index.isPositive ? (
                              <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 mr-1" />
                            )}
                            {index.change}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="h-[300px]">
              <MarketChart />
            </div>
          </TabsContent>
          <TabsContent value="sectors">
            <div className="h-[400px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Sector performance data would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="futures">
            <div className="h-[400px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Futures data would appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

