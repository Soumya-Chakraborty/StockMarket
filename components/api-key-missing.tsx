import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ApiKeyMissing() {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>API Key Missing</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>The Alpha Vantage API key is missing. The application is currently using sample data.</p>
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href="/setup">View Setup Instructions</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

