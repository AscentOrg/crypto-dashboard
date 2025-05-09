"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export function CryptoCard({ crypto, onClick }) {
  const [imageError, setImageError] = useState(false)

  const priceChangeColor = crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"

  const PriceChangeIcon = crypto.price_change_percentage_24h >= 0 ? ArrowUp : ArrowDown

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {!imageError ? (
            <Image
              src={crypto.image || "/placeholder.svg"}
              alt={crypto.name}
              width={40}
              height={40}
              className="rounded-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="font-bold">{crypto.name}</h3>
            <p className="text-muted-foreground uppercase">{crypto.symbol}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">{formatCurrency(crypto.current_price)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">24h Change</span>
            <span className={`flex items-center gap-1 ${priceChangeColor}`}>
              <PriceChangeIcon className="h-3 w-3" />
              {formatPercentage(crypto.price_change_percentage_24h)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="font-medium">{formatCurrency(crypto.market_cap)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Volume (24h)</span>
            <span className="font-medium">{formatCurrency(crypto.total_volume)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
