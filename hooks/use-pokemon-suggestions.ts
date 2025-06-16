import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "./use-debounce"

interface PokemonListItem {
  name: string
  url: string
}

interface PokemonListResponse {
  results: PokemonListItem[]
}

interface GameVersionGroup {
  name: string
  url: string
}

interface Generation {
  name: string
  version_groups: GameVersionGroup[]
  pokemon_species: Array<{
    name: string
    url: string
  }>
}

// Fetch all Pokemon names for suggestions
const fetchAllPokemon = async (): Promise<string[]> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1010")
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list")
  }
  const data: PokemonListResponse = await response.json()
  return data.results.map((pokemon) => pokemon.name)
}

// Fetch Pokemon by generation/game
const fetchPokemonByGame = async (gameVersion: string): Promise<string[]> => {
  // Map game versions to generation IDs
  const gameToGeneration: Record<string, number> = {
    "red-blue": 1,
    yellow: 1,
    "gold-silver": 2,
    crystal: 2,
    "ruby-sapphire": 3,
    emerald: 3,
    "firered-leafgreen": 3,
    "diamond-pearl": 4,
    platinum: 4,
    "heartgold-soulsilver": 4,
    "black-white": 5,
    "black-2-white-2": 5,
    "x-y": 6,
    "omega-ruby-alpha-sapphire": 6,
    "sun-moon": 7,
    "ultra-sun-ultra-moon": 7,
    "sword-shield": 8,
    "brilliant-diamond-shining-pearl": 8,
    "legends-arceus": 8,
    "scarlet-violet": 9,
  }

  const generationId = gameToGeneration[gameVersion]
  if (!generationId) {
    return []
  }

  const response = await fetch(`https://pokeapi.co/api/v2/generation/${generationId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch generation data")
  }

  const data: Generation = await response.json()
  return data.pokemon_species.map((pokemon) => pokemon.name)
}

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null))

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      )
    }
  }

  return matrix[str2.length][str1.length]
}

// Find similar Pokemon names
function findSimilarPokemon(query: string, pokemonList: string[], maxResults = 5): string[] {
  if (!query.trim()) return []

  const normalizedQuery = query.toLowerCase().trim()

  // First, find exact matches and starts-with matches
  const exactMatches = pokemonList.filter((name) => name === normalizedQuery)
  const startsWithMatches = pokemonList.filter((name) => name.startsWith(normalizedQuery) && name !== normalizedQuery)

  // Then find contains matches
  const containsMatches = pokemonList.filter(
    (name) => name.includes(normalizedQuery) && !name.startsWith(normalizedQuery) && name !== normalizedQuery,
  )

  // Finally, find fuzzy matches using Levenshtein distance
  const fuzzyMatches = pokemonList
    .filter(
      (name) => !exactMatches.includes(name) && !startsWithMatches.includes(name) && !containsMatches.includes(name),
    )
    .map((name) => ({
      name,
      distance: levenshteinDistance(normalizedQuery, name),
    }))
    .filter((item) => item.distance <= 3) // Only include if distance is 3 or less
    .sort((a, b) => a.distance - b.distance)
    .map((item) => item.name)

  // Combine all matches with priority order
  const allMatches = [
    ...exactMatches,
    ...startsWithMatches.slice(0, 3),
    ...containsMatches.slice(0, 2),
    ...fuzzyMatches.slice(0, 2),
  ]

  return allMatches.slice(0, maxResults)
}

export function usePokemonSuggestions(query: string, gameFilter?: string) {
  const debouncedQuery = useDebounce(query, 300)

  // Fetch all Pokemon or Pokemon by game
  const { data: allPokemon = [] } = useQuery({
    queryKey: ["pokemon-list"],
    queryFn: fetchAllPokemon,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  })

  const { data: gamePokemon = [] } = useQuery({
    queryKey: ["pokemon-by-game", gameFilter],
    queryFn: () => fetchPokemonByGame(gameFilter!),
    enabled: !!gameFilter && gameFilter !== "all",
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  })

  // Use filtered Pokemon list if game filter is active
  const pokemonList = gameFilter && gameFilter !== "all" ? gamePokemon : allPokemon
  const suggestions = findSimilarPokemon(debouncedQuery, pokemonList)

  return {
    suggestions,
    isLoading: debouncedQuery !== query, // Show loading while debouncing
    hasQuery: debouncedQuery.length > 0,
    totalPokemon: pokemonList.length,
    isFiltered: gameFilter && gameFilter !== "all",
  }
}
