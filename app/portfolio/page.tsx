import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioHoldings } from "@/components/portfolio-holdings"
import { PortfolioPerformance } from "@/components/portfolio-performance"
import { PortfolioAllocation } from "@/components/portfolio-allocation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PortfolioPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">Manage and track your investments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="text-3xl font-bold">$25,487.63</span>
              <span className="text-sm text-green-500">+$342.18 (1.36%) today</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Total Gain/Loss</span>
              <span className="text-3xl font-bold text-green-500">+$3,241.50</span>
              <span className="text-sm text-green-500">+14.58% all time</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Cash Balance</span>
              <span className="text-3xl font-bold">$1,250.00</span>
              <span className="text-sm text-muted-foreground">Available for investment</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Track your portfolio's performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioPerformance />
        </CardContent>
      </Card>

      <Tabs defaultValue="holdings">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="holdings" className="mt-4">
          <PortfolioHoldings />
        </TabsContent>
        <TabsContent value="allocation" className="mt-4">
          <PortfolioAllocation />
        </TabsContent>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Record of your buy and sell transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Transaction history would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

