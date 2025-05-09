"use client"

import { useEffect, useState } from "react"
import { fetchCryptoData } from "@/lib/crypto-api"
import { CryptoCard } from "@/components/crypto-card"
import { CryptoModal } from "@/components/crypto-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"

export function CryptoDashboard() {
  const [cryptoData, setCryptoData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [sortOrder, setSortOrder] = useState("market_cap_desc")
  const { theme } = useTheme()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchCryptoData(sortOrder)
        if (data && data.length > 0) {
          setCryptoData(data)
        } else {
          setError("No cryptocurrency data available. Please try again later.")
        }
      } catch (error) {
        console.error("Failed to fetch crypto data:", error)
        setError("Failed to load cryptocurrency data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Set up interval for real-time updates (every 60 seconds)
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [sortOrder])

  const filteredCryptos = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCryptoClick = (crypto) => {
    setSelectedCrypto(crypto)
  }

  const handleCloseModal = () => {
    setSelectedCrypto(null)
  }

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder)
  }

  const handleRetry = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCryptoData(sortOrder)
      if (data && data.length > 0) {
        setCryptoData(data)
      } else {
        setError("No cryptocurrency data available. Please try again later.")
      }
    } catch (error) {
      setError("Failed to load cryptocurrency data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Crypto Dashboard</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant={sortOrder === "market_cap_desc" ? "default" : "outline"}
          onClick={() => handleSortChange("market_cap_desc")}
          className="text-sm"
        >
          Market Cap ↓
        </Button>
        <Button
          variant={sortOrder === "price_desc" ? "default" : "outline"}
          onClick={() => handleSortChange("price_desc")}
          className="text-sm"
        >
          Price ↓
        </Button>
        <Button
          variant={sortOrder === "volume_desc" ? "default" : "outline"}
          onClick={() => handleSortChange("volume_desc")}
          className="text-sm"
        >
          Volume ↓
        </Button>
        <Button
          variant={sortOrder === "price_change_24h_desc" ? "default" : "outline"}
          onClick={() => handleSortChange("price_change_24h_desc")}
          className="text-sm"
        >
          24h Change ↓
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="h-[220px] rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCryptos.length > 0 ? (
            filteredCryptos.map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} onClick={() => handleCryptoClick(crypto)} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No cryptocurrencies found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {selectedCrypto && <CryptoModal crypto={selectedCrypto} onClose={handleCloseModal} />}
    </div>
  )
}
