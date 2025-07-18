'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  usePokemon,
  usePokemonSpecies,
  useEvolutionChain,
  useEncounters,
  useTmMoves,
  parseEvolutionChain,
} from '@/hooks/use-pokemon-data'
import { PokemonStats } from '@/components/pokemon-stats'
import { PokemonMoves } from '@/components/pokemon-moves'
import { PokemonLocations } from '@/components/pokemon-locations'
import { PokemonEvolution } from '@/components/pokemon-evolution'
import { PokemonImage } from '@/components/pokemon-image'
import { DittoLoader } from '@/components/ditto-loader'
import { PokemonAudioPlayer } from '@/components/pokemon-audio-player'
import { GameVersionSelector } from '@/components/game-version-selector'
import { useGameVersion } from '@/hooks/use-game-version'

interface PokemonCardProps {
  pokemonName: string
}

export function PokemonCard({ pokemonName }: PokemonCardProps) {
  const { gameVersion, setGameVersion } = useGameVersion()

  // Use cached queries
  const {
    data: pokemon,
    isLoading: pokemonLoading,
    error: pokemonError,
    refetch: refetchPokemon,
    isFetching: pokemonFetching,
  } = usePokemon(pokemonName)

  const {
    data: species,
    isLoading: speciesLoading,
    error: speciesError,
  } = usePokemonSpecies(pokemon?.id)

  const {
    data: evolutionChain,
    isLoading: evolutionLoading,
    error: evolutionError,
  } = useEvolutionChain(species?.evolution_chain.url)

  const {
    data: encounters,
    isLoading: encountersLoading,
    error: encountersError,
  } = useEncounters(pokemon?.id)

  const tmMovesQueries = useTmMoves(pokemon?.moves, gameVersion)
  const tmMovesLoading = tmMovesQueries.some((query) => query.isLoading)
  const tmMovesData = tmMovesQueries
    .filter((query) => query.data)
    .map((query) => ({
      name: query.data!.name,
      type: query.data!.type.name,
      power: query.data!.power,
      accuracy: query.data!.accuracy,
      machines: query.data!.machines.filter(
        (machine) =>
          machine.version_group.name === gameVersion ||
          (gameVersion === 'red-blue' &&
            machine.version_group.name === 'yellow'),
      ),
    }))

  const getTypeColor = (type: string): string =>
    `bg-pokemonTypes-${type} hover:bg-pokemonTypes-${type}`

  const isLoading =
    pokemonLoading ||
    speciesLoading ||
    evolutionLoading ||
    encountersLoading ||
    tmMovesLoading
  const hasError =
    pokemonError || speciesError || evolutionError || encountersError

  if (pokemonLoading && !pokemon) {
    return <LoadingCard />
  }

  if (hasError && !pokemon) {
    return (
      <ErrorCard
        error={pokemonError?.message}
        onRetry={() => refetchPokemon()}
      />
    )
  }

  if (!pokemon) return null

  const evolutions = evolutionChain
    ? parseEvolutionChain(evolutionChain.chain)
    : []
  const filteredEncounters =
    encounters?.filter((encounter) =>
      encounter.version_details.some((detail) => {
        if (gameVersion === 'red-blue') {
          return detail.version.name === 'red' || detail.version.name === 'blue'
        }
        return detail.version.name === gameVersion.split('-')[0]
      }),
    ) || []

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur">
      <PokemonHeader
        pokemon={pokemon}
        isFetching={pokemonFetching}
        getTypeColor={getTypeColor}
      />

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {/* Pass both pokemon object and gameVersion */}
            <PokemonAudioPlayer pokemon={pokemon} />
          </div>
          <GameVersionSelector
            currentVersion={gameVersion}
            onVersionChange={setGameVersion}
          />
        </div>
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="moves" className="relative">
              TMs & Moves
              {tmMovesLoading && (
                <Loader2 className="h-3 w-3 animate-spin ml-1" />
              )}
            </TabsTrigger>
            <TabsTrigger value="locations" className="relative">
              Locations
              {encountersLoading && (
                <Loader2 className="h-3 w-3 animate-spin ml-1" />
              )}
            </TabsTrigger>
            <TabsTrigger value="evolution" className="relative">
              Evolution
              {evolutionLoading && (
                <Loader2 className="h-3 w-3 animate-spin ml-1" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <PokemonStats stats={pokemon.stats} />
          </TabsContent>

          <TabsContent value="moves" className="space-y-4">
            <PokemonMoves
              moves={tmMovesData}
              isLoading={tmMovesLoading}
              getTypeColor={getTypeColor}
              gameVersion={gameVersion}
            />
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <PokemonLocations
              encounters={filteredEncounters}
              isLoading={encountersLoading}
              gameVersion={gameVersion}
            />
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4">
            <PokemonEvolution
              evolutions={evolutions}
              isLoading={evolutionLoading}
              evolutionChainUrl={species?.evolution_chain.url}
              currentPokemon={pokemon.name}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Optimized sub-components
function LoadingCard() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="flex items-center justify-center h-64">
        <DittoLoader size={120} />
      </CardContent>
    </Card>
  )
}

function ErrorCard({
  error,
  onRetry,
}: {
  error?: string
  onRetry: () => void
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || 'An error occurred while loading Pokémon data'}
          </p>
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface PokemonHeaderProps {
  pokemon: any
  isFetching: boolean
  getTypeColor: (type: string) => string
}

function PokemonHeader({
  pokemon,
  isFetching,
  getTypeColor,
}: PokemonHeaderProps) {
  return (
    <CardHeader className="text-center">
      <div className="flex items-center justify-center gap-4 mb-4 relative">
        <PokemonImage
          src={
            pokemon.sprites.other['official-artwork'].front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          width={150}
          height={150}
          className="relative"
        />
        {isFetching && (
          <div className="absolute top-0 right-0">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          </div>
        )}
      </div>
      <CardTitle className="text-3xl font-bold capitalize">
        {pokemon.name} #{pokemon.id.toString().padStart(3, '0')}
      </CardTitle>
      <div className="flex justify-center gap-2">
        {pokemon.types.map((type: any) => (
          <Badge
            key={type.type.name}
            className={`${getTypeColor(type.type.name)} text-white hover:${getTypeColor(type.type.name)}`}
          >
            {type.type.name}
          </Badge>
        ))}
      </div>
    </CardHeader>
  )
}
