import { ApiKeyInstructions } from "@/components/api-key-instructions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SetupPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Setup</h1>
          <p className="text-muted-foreground">Configure your API key to enable real-time stock data</p>
        </div>
        <Button asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>

      <ApiKeyInstructions />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Additional Information</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">API Rate Limits</h3>
          <p className="text-muted-foreground">The free tier of Alpha Vantage API has the following limitations:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>5 API requests per minute</li>
            <li>500 API requests per day</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Error Handling</h3>
          <p className="text-muted-foreground">
            If the API key is missing or invalid, or if the API rate limit is exceeded, the application will fall back
            to using sample data. You will see a notification when this happens.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Deployment</h3>
          <p className="text-muted-foreground">
            When deploying to Vercel or another hosting platform, make sure to set the{" "}
            <code className="bg-muted px-1 py-0.5 rounded">ALPHA_VANTAGE_API_KEY</code> environment variable in your
            project settings.
          </p>
        </div>
      </div>
    </main>
  )
}

