import { SearchStocks } from "@/components/search-stocks"
import { MarketOverview } from "@/components/market-overview"
import { TrendingStocks } from "@/components/trending-stocks"
import { RecentNews } from "@/components/recent-news"
import { WatchlistCard } from "@/components/watchlist-card"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { ApiKeyMissing } from "@/components/api-key-missing"
import { isApiKeyAvailable } from "@/lib/api"

export default async function Home() {
  const apiKeyAvailable = isApiKeyAvailable()

  return (
    <main className="container mx-auto p-4 space-y-6">
      {!apiKeyAvailable && <ApiKeyMissing />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Dashboard</h1>
          <p className="text-muted-foreground">
            Track stocks, manage your portfolio, and stay updated with market news
          </p>
        </div>
        <SearchStocks />
      </div>

      <MarketOverview />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TrendingStocks />
          <RecentNews />
        </div>
        <div className="space-y-6">
          <WatchlistCard />
          <PortfolioSummary />
        </div>
      </div>
    </main>
  )
}

