// Alpha Vantage API base URL
export const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"

// Function to check if API key is available
export function isApiKeyAvailable(): boolean {
  return !!process.env.ALPHA_VANTAGE_API_KEY
}

// Error handling for API responses
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`

    try {
      const errorData = await response.json()
      errorMessage += `: ${errorData.message || response.statusText}`
    } catch (e) {
      // If we can't parse the error as JSON, just use the status text
      errorMessage += `: ${response.statusText}`
    }

    throw new Error(errorMessage)
  }

  // Get the response as text first
  const text = await response.text()

  // Check if the response is empty
  if (!text || text.trim() === "") {
    throw new Error("Empty response from API")
  }

  try {
    // Try to parse the text as JSON
    const data = JSON.parse(text)

    // Alpha Vantage specific error handling
    if (data["Error Message"]) {
      throw new Error(`Alpha Vantage API error: ${data["Error Message"]}`)
    }

    if (data["Information"]) {
      // This is usually a rate limit message
      console.warn(`Alpha Vantage API info: ${data["Information"]}`)
    }

    if (data["Note"]) {
      // This is usually a rate limit message
      console.warn(`Alpha Vantage API note: ${data["Note"]}`)
    }

    return data as T
  } catch (error) {
    console.error("Failed to parse API response:", error)
    console.error("Response text:", text)
    throw new Error("Invalid JSON response from API")
  }
}

// Function to format large numbers (e.g., market cap)
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}T`
  }
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`
  }
  return num.toString()
}

// Function to format percentage
export function formatPercentage(num: number): string {
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`
}

// Function to format currency
export function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

