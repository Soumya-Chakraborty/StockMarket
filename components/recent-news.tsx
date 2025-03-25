"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NewsItem {
  id: number
  title: string
  source: string
  time: string
  url: string
}

export function RecentNews() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/news")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to fetch data: ${response.status}`)
        }

        const data = await response.json()
        setNewsItems(data)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError(err.message || "Failed to load news")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market News</CardTitle>
        <CardDescription>Latest financial news and market updates</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : newsItems.length > 0 ? (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                <Link
                  href={item.url}
                  className="block space-y-1 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{item.source}</span>
                    <span className="mx-2">•</span>
                    <span>{item.time}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">No news available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

