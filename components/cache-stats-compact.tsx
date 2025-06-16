"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Database, ChevronDown } from "lucide-react"

interface CacheStatsCompactProps {
  stats: {
    total: number
    fresh: number
    stale: number
    endpoints: Record<string, number>
  }
  onClear: () => void
}

export function CacheStatsCompact({ stats, onClear }: CacheStatsCompactProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white/90 hover:bg-white/10 h-8 px-2">
          <Database className="h-3 w-3 mr-1" />
          <span className="text-xs">{stats.total}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Cache Statistics</h4>
            <Button variant="outline" size="sm" onClick={onClear} className="text-xs h-6 px-2">
              Clear Cache
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-600">{stats.fresh}</div>
              <div className="text-xs text-gray-500">Fresh</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-orange-600">{stats.stale}</div>
              <div className="text-xs text-gray-500">Stale</div>
            </div>
          </div>

          <div className="border-t pt-3">
            <h5 className="text-sm font-medium mb-2">Endpoints Hit</h5>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(stats.endpoints).map(([endpoint, count]) => (
                <div key={endpoint} className="flex justify-between items-center bg-gray-50 rounded px-2 py-1">
                  <span className="font-medium truncate">{endpoint}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
