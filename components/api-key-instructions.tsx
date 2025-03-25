import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export function ApiKeyInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Setup Instructions</CardTitle>
        <CardDescription>Follow these steps to set up your Alpha Vantage API key</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            This application uses Alpha Vantage API to fetch real-time stock data. You need to set up an API key to use
            all features.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Step 1: Get an Alpha Vantage API Key</h3>
          <p className="text-sm text-muted-foreground">
            Visit{" "}
            <a
              href="https://www.alphavantage.co/support/#api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Alpha Vantage
            </a>{" "}
            and sign up for a free API key.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Step 2: Set Up Environment Variables</h3>
          <p className="text-sm text-muted-foreground">
            Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in the root of your project
            with the following content:
          </p>
          <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">ALPHA_VANTAGE_API_KEY=your_api_key_here</pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Step 3: Restart Your Development Server</h3>
          <p className="text-sm text-muted-foreground">
            After setting up the environment variable, restart your development server to apply the changes.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Limitations</AlertTitle>
          <AlertDescription>
            The free tier of Alpha Vantage API has a limit of 5 requests per minute and 500 requests per day. If you
            exceed these limits, the application will fall back to using sample data.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

