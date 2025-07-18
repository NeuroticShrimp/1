'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Search, List, Hash, Eye, EyeOff } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { gameVersions } from '@/lib/constants'
import { PokemonImage } from './pokemon-image'
import { DittoLoader } from './ditto-loader'

interface PokemonListItem {
  id: number
  name: string
  types: string[]
  sprite: string
}

interface PokemonListProps {
  onPokemonSelect: (pokemon: string) => void
  currentPokemon?: string
}

export function PokemonList({
  onPokemonSelect,
  currentPokemon,
}: PokemonListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState('red-blue')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showImages, setShowImages] = useState(true)

  const { data: pokemonList = [], isLoading } = useQuery({
    queryKey: ['pokemon-list-detailed', selectedGame],
    queryFn: async () => {
      const gameToGeneration: Record<string, number> = {
        'red-blue': 1,
        yellow: 1,
        'gold-silver': 2,
        crystal: 2,
        'ruby-sapphire': 3,
        emerald: 3,
        'firered-leafgreen': 3,
        'diamond-pearl': 4,
        platinum: 4,
        'heartgold-soulsilver': 4,
        'black-white': 5,
        'black-2-white-2': 5,
        'x-y': 6,
        'omega-ruby-alpha-sapphire': 6,
        'sun-moon': 7,
        'ultra-sun-ultra-moon': 7,
        'sword-shield': 8,
        'brilliant-diamond-shining-pearl': 8,
        'legends-arceus': 8,
        'scarlet-violet': 9,
      }
      const generationId = gameToGeneration[selectedGame]
      if (!generationId) return []
      const genResponse = await fetch(
        `https://pokeapi.co/api/v2/generation/${generationId}`,
      )
      const genData = await genResponse.json()
      const pokemonPromises = genData.pokemon_species.map(
        async (species: any) => {
          try {
            const pokemonResponse = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${species.name}`,
            )
            const pokemonData = await pokemonResponse.json()
            return {
              id: pokemonData.id,
              name: pokemonData.name,
              types: pokemonData.types.map((t: any) => t.type.name),
              sprite:
                pokemonData.sprites.front_default ||
                pokemonData.sprites.other?.['official-artwork']?.front_default,
            }
          } catch (error) {
            console.error(`Failed to fetch ${species.name}:`, error)
            return null
          }
        },
      )
      const results = await Promise.all(pokemonPromises)
      return results
        .filter(Boolean)
        .sort((a, b) => a!.id - b!.id) as PokemonListItem[]
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  })

  const availableTypes = useMemo(() => {
    const types = new Set<string>()
    pokemonList.forEach((pokemon) => {
      pokemon.types.forEach((type) => types.add(type))
    })
    return Array.from(types).sort()
  }, [pokemonList])

  const filteredPokemon = useMemo(() => {
    return pokemonList.filter((pokemon) => {
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.id.toString().includes(searchQuery)
      const matchesType =
        typeFilter === 'all' || pokemon.types.includes(typeFilter)
      return matchesSearch && matchesType
    })
  }, [pokemonList, searchQuery, typeFilter])

  const getGameDisplayName = (gameValue: string) => {
    const game = gameVersions.find((g) => g.value === gameValue)
    return game?.label || gameValue
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-500',
      psychic: 'bg-pink-500',
      ice: 'bg-cyan-500',
      dragon: 'bg-purple-500',
      dark: 'bg-gray-800',
      fairy: 'bg-pink-300',
      normal: 'bg-gray-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-600',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      steel: 'bg-gray-500',
    }
    return colors[type] || 'bg-gray-400'
  }

  const handlePokemonSelect = (pokemon: string) => {
    onPokemonSelect(pokemon)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white"
        >
          <List className="h-4 w-4" />
          Browse Pokemon
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Pokemon Browser
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImages(!showImages)}
                className="flex items-center gap-1"
              >
                {showImages ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Game Version
            </label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gameVersions.map((game) => (
                  <SelectItem key={game.value} value={game.value}>
                    {game.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search Pokemon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getTypeColor(type)}`}
                      />
                      <span className="capitalize">{type}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 border-b pb-2">
            <span>
              {getGameDisplayName(selectedGame)} - {filteredPokemon.length} of{' '}
              {pokemonList.length}
            </span>
            {(searchQuery || typeFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                }}
                className="text-xs h-6"
              >
                Clear
              </Button>
            )}
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <DittoLoader size={32} showText={false} />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {filteredPokemon.map((poke) => (
                  <Card
                    key={poke.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      currentPokemon === poke.name
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : ''
                    }`}
                    onClick={() => handlePokemonSelect(poke.name)}
                  >
                    <CardContent className="p-3 text-center">
                      {showImages && (
                        <div className="w-16 h-16 mx-auto mb-2">
                          {poke.sprite ? (
                            <PokemonImage
                              src={poke.sprite}
                              alt={poke.name}
                              width={64}
                              height={64}
                              className="rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                              <Hash className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="font-medium text-sm capitalize truncate">
                          {poke.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          #{poke.id.toString().padStart(3, '0')}
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {poke.types.map((type) => (
                            <Badge
                              key={type}
                              className={`${getTypeColor(type)} text-white text-xs`}
                              variant="secondary"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
