'use client'
import { useState } from 'react'
import { PokemonCard } from '@/components/pokemon-card'
import { PokemonSearch } from '@/components/pokemon-search'
import { PokemonList } from '@/components/pokemon-list'
import { GameFilterDropdown } from '@/components/game-filter-dropdown'
import { CacheStatsCompact } from '@/components/cache-stats-compact'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function PokemonApp() {
  const [searchValue, setSearchValue] = useState('')
  const [searchedPokemon, setSearchedPokemon] = useState('pikachu')
  const [recentSearches, setRecentSearches] = useState<string[]>(['pikachu'])
  const [gameFilter, setGameFilter] = useState<string>('all')

  const queryClient = useQueryClient()

  const handleSearch = (pokemon: string) => {
    const newPokemon = pokemon.toLowerCase().trim()
    setSearchedPokemon(newPokemon)

    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((p) => p !== newPokemon)
      return [newPokemon, ...filtered].slice(0, 8)
    })
  }

  const handlePokemonSelect = (pokemon: string) => {
    setSearchedPokemon(pokemon.toLowerCase())
  }

  const handleRecentSearch = (pokemon: string) => {
    setSearchedPokemon(pokemon)
  }

  const clearCache = () => {
    queryClient.clear()
  }

  const clearRecentSearches = () => {
    setRecentSearches([searchedPokemon]) // Keep current Pokemon
  }

  const getCacheStats = () => {
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()

    // Group endpoints by type
    const endpoints = queries.reduce((acc: Record<string, number>, query) => {
      const key = query.queryKey[0] as string
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return {
      total: queries.length,
      fresh: queries.filter((q) => q.isStale() === false).length,
      stale: queries.filter((q) => q.isStale() === true).length,
      endpoints,
    }
  }

  const cacheStats = getCacheStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Top Left Game Filter */}
        <div className="absolute top-4 left-4 z-10">
          <GameFilterDropdown
            currentVersion={gameFilter}
            onVersionChange={setGameFilter}
          />
        </div>

        {/* Main Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-6 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8" />
            Pokédex
          </h1>

          {/* Search Bar with Pokemon List Button and Cache Stats */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <PokemonSearch
                value={searchValue}
                onChange={setSearchValue}
                onSearch={handleSearch}
                recentSearches={recentSearches}
                onRecentSearch={handleRecentSearch}
                onClearRecent={clearRecentSearches}
              />
              <PokemonList
                onPokemonSelect={handlePokemonSelect}
                currentPokemon={searchedPokemon}
              />
            </div>
            <CacheStatsCompact stats={cacheStats} onClear={clearCache} />
          </div>

          {/* Quick Access Recent Searches */}
          {recentSearches.length > 1 && (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-white text-sm">Quick Access:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="h-5 w-5 p-0 text-white/60 hover:text-white/80"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {recentSearches.slice(1, 6).map((pokemon) => (
                  <Badge
                    key={pokemon}
                    variant="secondary"
                    className="cursor-pointer hover:bg-white/80 transition-colors"
                    onClick={() => handleRecentSearch(pokemon)}
                  >
                    {pokemon}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pokemon Card */}
        <PokemonCard pokemonName={searchedPokemon} />
      </div>
    </div>
  )
}
