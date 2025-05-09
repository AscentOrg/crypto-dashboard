// Update the API endpoints to use our own route handlers instead of directly calling CoinGecko
// This will help avoid CORS issues and provide fallback data

// Fetch top cryptocurrencies
export async function fetchCryptoData(sortBy = "market_cap_desc", perPage = 50) {
  try {
    const response = await fetch(`/api/crypto?sort=${sortBy}&per_page=${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return []
  }
}

// Fetch detailed information for a specific cryptocurrency
export async function fetchCryptoDetails(id) {
  try {
    const response = await fetch(`/api/crypto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching details for ${id}:`, error)
    return null
  }
}

// Fetch historical price data for a cryptocurrency
export async function fetchCryptoHistory(id, days = 7) {
  // This function is not currently used, but we'll keep it for future implementation
  try {
    const response = await fetch(`/api/crypto/history?id=${id}&days=${days}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching history for ${id}:`, error)
    return null
  }
}
