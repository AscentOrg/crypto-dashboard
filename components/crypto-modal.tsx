"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCryptoDetails } from "@/lib/crypto-api"
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/utils"

export function CryptoModal({ crypto, onClose }) {
  const [details, setDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true)
      try {
        const data = await fetchCryptoDetails(crypto.id)
        if (data) {
          setDetails(data)
        }
      } catch (error) {
        console.error("Failed to fetch crypto details:", error)
        // We'll continue with basic data from the crypto prop
      } finally {
        setIsLoading(false)
      }
    }

    loadDetails()
  }, [crypto.id])

  const priceChangeColor = crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"

  const PriceChangeIcon = crypto.price_change_percentage_24h >= 0 ? ArrowUp : ArrowDown

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-3">
          <Image
            src={crypto.image || "/placeholder.svg"}
            alt={crypto.name}
            width={32}
            height={32}
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=32&width=32"
            }}
          />
          <DialogTitle className="text-xl">
            {crypto.name} ({crypto.symbol.toUpperCase()})
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-3xl font-bold">{formatCurrency(crypto.current_price)}</h3>
              <div className={`flex items-center gap-1 ${priceChangeColor}`}>
                <PriceChangeIcon className="h-4 w-4" />
                {formatPercentage(crypto.price_change_percentage_24h)}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`https://www.coingecko.com/en/coins/${crypto.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  CoinGecko
                </a>
              </Button>
              {details?.links?.homepage[0] && (
                <Button variant="outline" size="sm" asChild>
                  <a href={details.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="market">Market Data</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Market Cap Rank</div>
                  <div className="font-medium">#{crypto.market_cap_rank}</div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Market Cap</div>
                  <div className="font-medium">{formatCurrency(crypto.market_cap)}</div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">24h Volume</div>
                  <div className="font-medium">{formatCurrency(crypto.total_volume)}</div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Circulating Supply</div>
                  <div className="font-medium">
                    {formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
                  </div>
                </div>
              </div>

              {details?.description?.en && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <div className="text-sm text-muted-foreground line-clamp-4">
                    {details.description.en.replace(/<\/?[^>]+(>|$)/g, "")}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="market" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">All-Time High</div>
                  <div className="font-medium">
                    {details?.market_data?.ath?.usd ? formatCurrency(details.market_data.ath.usd) : "N/A"}
                  </div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">All-Time Low</div>
                  <div className="font-medium">
                    {details?.market_data?.atl?.usd ? formatCurrency(details.market_data.atl.usd) : "N/A"}
                  </div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Price Change (7d)</div>
                  <div
                    className={
                      details?.market_data?.price_change_percentage_7d >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {details?.market_data?.price_change_percentage_7d
                      ? formatPercentage(details.market_data.price_change_percentage_7d)
                      : "N/A"}
                  </div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Price Change (30d)</div>
                  <div
                    className={
                      details?.market_data?.price_change_percentage_30d >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {details?.market_data?.price_change_percentage_30d
                      ? formatPercentage(details.market_data.price_change_percentage_30d)
                      : "N/A"}
                  </div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Total Supply</div>
                  <div className="font-medium">
                    {crypto.total_supply ? formatNumber(crypto.total_supply) : "∞"} {crypto.symbol.toUpperCase()}
                  </div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm">Max Supply</div>
                  <div className="font-medium">
                    {crypto.max_supply ? formatNumber(crypto.max_supply) : "∞"} {crypto.symbol.toUpperCase()}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-4">
              {isLoading ? (
                <div className="h-[200px] bg-muted/60 animate-pulse rounded-lg"></div>
              ) : (
                <div>
                  {details?.description?.en ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: details.description.en }} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No description available.</p>
                  )}

                  {details?.links && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {details.links.blockchain_site
                          .slice(0, 3)
                          .filter(Boolean)
                          .map((site, index) => (
                            <Button key={index} variant="outline" size="sm" asChild>
                              <a href={site} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                Explorer {index + 1}
                              </a>
                            </Button>
                          ))}

                        {details.links.repos_url.github.filter(Boolean).length > 0 && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={details.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-2" />
                              GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
