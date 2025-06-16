"use client"

import { Loader2, ArrowRight, Settings } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EvolutionConditions } from "./evolution-conditions"
import { PokemonImage } from "./pokemon-image"
import { useQuery } from "@tanstack/react-query"

interface Evolution {
  name: string
  details: any
}

interface PokemonEvolutionProps {
  evolutions: Evolution[]
  isLoading: boolean
  evolutionChainUrl?: string
  currentPokemon?: string
}

export function PokemonEvolution({ evolutions, isLoading, evolutionChainUrl, currentPokemon }: PokemonEvolutionProps) {
  const [showConditions, setShowConditions] = useState(false)

  const formatEvolutionDetails = (details: any) => {
    if (!details) return "Base form"

    let condition = ""
    if (details.min_level) condition += `Level ${details.min_level}`
    if (details.item) condition += `Use ${details.item.name.replace("-", " ")}`
    if (details.time_of_day) condition += ` (${details.time_of_day})`
    if (details.location) condition += ` at ${details.location.name.replace("-", " ")}`
    if (details.held_item) condition += ` holding ${details.held_item.name.replace("-", " ")}`
    if (details.min_happiness) condition += ` with ${details.min_happiness} happiness`
    if (details.known_move) condition += ` knowing ${details.known_move.name.replace("-", " ")}`
    if (details.trigger?.name === "trade") condition += " via trade"
    if (details.gender === 1) condition += " (female only)"
    if (details.gender === 2) condition += " (male only)"
    if (details.turn_upside_down) condition += " (turn device upside down)"

    return condition || "Special condition"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Evolution Chain
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </h3>
        {evolutionChainUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConditions(!showConditions)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {showConditions ? "Hide" : "Show"} Conditions
          </Button>
        )}
      </div>

      {/* Traditional Evolution Chain */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4">
        {evolutions.length > 0 ? (
          evolutions.map((evolution, index) => (
            <EvolutionStage
              key={index}
              evolution={evolution}
              isLast={index === evolutions.length - 1}
              formatDetails={formatEvolutionDetails}
            />
          ))
        ) : isLoading ? (
          <LoadingEvolution />
        ) : (
          <p className="text-gray-500">No evolution data available</p>
        )}
      </div>

      {/* Evolution Conditions */}
      {showConditions && evolutionChainUrl && (
        <EvolutionConditions evolutionChainUrl={evolutionChainUrl} currentPokemon={currentPokemon || "unknown"} />
      )}
    </div>
  )
}

interface EvolutionStageProps {
  evolution: Evolution
  isLast: boolean
  formatDetails: (details: any) => string
}

function EvolutionStage({ evolution, isLast, formatDetails }: EvolutionStageProps) {
  // Fetch Pokemon data to get the image
  const { data: pokemon } = useQuery({
    queryKey: ["pokemon", evolution.name],
    queryFn: async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.name}`)
      return response.json()
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const imageUrl = pokemon?.sprites?.other?.["official-artwork"]?.front_default || pokemon?.sprites?.front_default

  return (
    <div className="flex items-center gap-4 min-w-fit">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2 overflow-hidden">
          {imageUrl ? (
            <PokemonImage src={imageUrl} alt={evolution.name} width={80} height={80} className="scale-110" />
          ) : (
            <span className="text-2xl">🔮</span>
          )}
        </div>
        <div className="font-medium capitalize">{evolution.name}</div>
        <div className="text-xs text-gray-500 mt-1 max-w-24 break-words">{formatDetails(evolution.details)}</div>
      </div>
      {!isLast && <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />}
    </div>
  )
}

function LoadingEvolution() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}
