"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Hash } from "lucide-react"
import { gameVersions } from "@/lib/constants"

interface GameFilterStatsProps {
  currentGame: string
  totalPokemon: number
  isFiltered: boolean
}

export function GameFilterStats({ currentGame, totalPokemon, isFiltered }: GameFilterStatsProps) {
  if (!isFiltered) return null

  const getGameDisplayName = (gameValue: string) => {
    const game = gameVersions.find((g) => g.value === gameValue)
    return game?.label || gameValue
  }

  const getGenerationInfo = (gameValue: string) => {
    const genMap: Record<string, { gen: number; year: string }> = {
      "red-blue": { gen: 1, year: "1996" },
      yellow: { gen: 1, year: "1998" },
      "gold-silver": { gen: 2, year: "1999" },
      crystal: { gen: 2, year: "2000" },
      "ruby-sapphire": { gen: 3, year: "2002" },
      emerald: { gen: 3, year: "2004" },
      "firered-leafgreen": { gen: 3, year: "2004" },
      "diamond-pearl": { gen: 4, year: "2006" },
      platinum: { gen: 4, year: "2008" },
      "heartgold-soulsilver": { gen: 4, year: "2009" },
      "black-white": { gen: 5, year: "2010" },
      "black-2-white-2": { gen: 5, year: "2012" },
      "x-y": { gen: 6, year: "2013" },
      "omega-ruby-alpha-sapphire": { gen: 6, year: "2014" },
      "sun-moon": { gen: 7, year: "2016" },
      "ultra-sun-ultra-moon": { gen: 7, year: "2017" },
      "sword-shield": { gen: 8, year: "2019" },
      "brilliant-diamond-shining-pearl": { gen: 8, year: "2021" },
      "legends-arceus": { gen: 8, year: "2022" },
      "scarlet-violet": { gen: 9, year: "2022" },
    }

    return genMap[gameValue] || { gen: 0, year: "Unknown" }
  }

  const gameInfo = getGenerationInfo(currentGame)

  return (
    <Card className="bg-white/10 border-white/20 text-white mb-4">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            <span className="font-medium">{getGameDisplayName(currentGame)}</span>
            <Badge variant="secondary" className="text-xs">
              Gen {gameInfo.gen}
            </Badge>
            <Badge variant="outline" className="text-xs border-white/30 text-white/80">
              {gameInfo.year}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Hash className="h-3 w-3" />
            <span>{totalPokemon} Pokémon</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
