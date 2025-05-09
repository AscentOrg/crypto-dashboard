import { NextResponse } from "next/server"

// CoinGecko API URL
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

// Handler for fetching cryptocurrency list
export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sort") || "market_cap_desc"
    const perPage = searchParams.get("per_page") || "50"

    // Fetch data from CoinGecko
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=${sortBy}&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          Accept: "application/json",
          // Add a user agent to avoid being blocked
          "User-Agent": "Cryptocurrency Dashboard",
        },
        // Add cache control
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching crypto data:", error)

    // Return fallback data in case of error
    return NextResponse.json(FALLBACK_DATA, { status: 200 })
  }
}

// Handler for fetching cryptocurrency details
export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Cryptocurrency ID is required" }, { status: 400 })
    }

    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cryptocurrency Dashboard",
        },
        next: { revalidate: 60 },
      },
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching crypto details:", error)

    // Return fallback data for the requested cryptocurrency
    const fallbackCrypto = FALLBACK_DATA.find((crypto) => crypto.id === request.body?.id)

    if (fallbackCrypto) {
      return NextResponse.json({
        id: fallbackCrypto.id,
        name: fallbackCrypto.name,
        symbol: fallbackCrypto.symbol,
        description: { en: "Data currently unavailable. Please try again later." },
        links: {
          homepage: ["https://example.com"],
          blockchain_site: [],
          repos_url: { github: [] },
        },
        market_data: {
          current_price: { usd: fallbackCrypto.current_price },
          ath: { usd: fallbackCrypto.current_price * 1.5 },
          atl: { usd: fallbackCrypto.current_price * 0.5 },
          price_change_percentage_7d: 0,
          price_change_percentage_30d: 0,
        },
      })
    }

    return NextResponse.json({ error: "Failed to fetch cryptocurrency details" }, { status: 500 })
  }
}

// Fallback data in case the API fails
const FALLBACK_DATA = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 68000,
    market_cap: 1330000000000,
    market_cap_rank: 1,
    total_volume: 25000000000,
    price_change_percentage_24h: 2.5,
    circulating_supply: 19500000,
    total_supply: 21000000,
    max_supply: 21000000,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3500,
    market_cap: 420000000000,
    market_cap_rank: 2,
    total_volume: 15000000000,
    price_change_percentage_24h: 1.8,
    circulating_supply: 120000000,
    total_supply: null,
    max_supply: null,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1,
    market_cap: 95000000000,
    market_cap_rank: 3,
    total_volume: 50000000000,
    price_change_percentage_24h: 0.1,
    circulating_supply: 95000000000,
    total_supply: 95000000000,
    max_supply: null,
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 600,
    market_cap: 92000000000,
    market_cap_rank: 4,
    total_volume: 1500000000,
    price_change_percentage_24h: 1.2,
    circulating_supply: 153000000,
    total_supply: 153000000,
    max_supply: 153000000,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 150,
    market_cap: 65000000000,
    market_cap_rank: 5,
    total_volume: 2500000000,
    price_change_percentage_24h: 3.5,
    circulating_supply: 430000000,
    total_supply: 550000000,
    max_supply: null,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.45,
    market_cap: 16000000000,
    market_cap_rank: 9,
    total_volume: 500000000,
    price_change_percentage_24h: -1.2,
    circulating_supply: 35500000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.15,
    market_cap: 21000000000,
    market_cap_rank: 8,
    total_volume: 1200000000,
    price_change_percentage_24h: 0.8,
    circulating_supply: 140000000000,
    total_supply: null,
    max_supply: null,
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 7.5,
    market_cap: 10000000000,
    market_cap_rank: 12,
    total_volume: 350000000,
    price_change_percentage_24h: -0.5,
    circulating_supply: 1330000000,
    total_supply: 1330000000,
    max_supply: null,
  },
]
