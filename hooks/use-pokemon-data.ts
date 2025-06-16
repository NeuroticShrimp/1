import { useQuery, useQueries } from "@tanstack/react-query"

interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  cries?: {
    latest?: string
    legacy?: string
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  moves: Array<{
    move: {
      name: string
      url: string
    }
    version_group_details: Array<{
      level_learned_at: number
      move_learn_method: {
        name: string
      }
      version_group: {
        name: string
      }
    }>
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
}

interface Species {
  evolution_chain: {
    url: string
  }
}

interface EvolutionChain {
  chain: {
    species: {
      name: string
    }
    evolution_details: Array<{
      min_level?: number
      item?: {
        name: string
      }
      trigger: {
        name: string
      }
      time_of_day?: string
      location?: {
        name: string
      }
    }>
    evolves_to: Array<any>
  }
}

interface Move {
  name: string
  machines: Array<{
    machine: {
      url: string
    }
    version_group: {
      name: string
    }
  }>
  type: {
    name: string
  }
  power: number | null
  accuracy: number | null
}

interface Encounter {
  location_area: {
    name: string
    url: string
  }
  version_details: Array<{
    max_chance: number
    version: {
      name: string
    }
  }>
}

// API functions
const fetchPokemon = async (name: string): Promise<Pokemon> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
  if (!response.ok) {
    throw new Error("Pokémon not found")
  }
  return response.json()
}

const fetchSpecies = async (id: number): Promise<Species> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  if (!response.ok) {
    throw new Error("Species not found")
  }
  return response.json()
}

const fetchEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Evolution chain not found")
  }
  return response.json()
}

const fetchEncounters = async (id: number): Promise<Encounter[]> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
  if (!response.ok) {
    throw new Error("Encounters not found")
  }
  return response.json()
}

const fetchMove = async (url: string): Promise<Move> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Move not found")
  }
  return response.json()
}

// Custom hooks
export function usePokemon(name: string) {
  return useQuery({
    queryKey: ["pokemon", name.toLowerCase()],
    queryFn: () => fetchPokemon(name),
    enabled: !!name,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}

export function usePokemonSpecies(id: number | undefined) {
  return useQuery({
    queryKey: ["pokemon-species", id],
    queryFn: () => fetchSpecies(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: ["evolution-chain", url],
    queryFn: () => fetchEvolutionChain(url!),
    enabled: !!url,
    staleTime: 1000 * 60 * 20, // 20 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  })
}

export function useEncounters(id: number | undefined) {
  return useQuery({
    queryKey: ["encounters", id],
    queryFn: () => fetchEncounters(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useTmMoves(moves: Pokemon["moves"] | undefined, gameVersion = "red-blue") {
  // Filter TM moves for the selected game version
  const tmMoves =
    moves
      ?.filter((move) =>
        move.version_group_details.some(
          (detail) =>
            detail.move_learn_method.name === "machine" &&
            (detail.version_group.name === gameVersion ||
              (gameVersion === "red-blue" && detail.version_group.name === "yellow")),
        ),
      )
      .slice(0, 10) || []

  // Use useQueries to fetch multiple moves in parallel with caching
  return useQueries({
    queries: tmMoves.map((move) => ({
      queryKey: ["move", move.move.url],
      queryFn: () => fetchMove(move.move.url),
      staleTime: 1000 * 60 * 30, // 30 minutes
      gcTime: 1000 * 60 * 60 * 4, // 4 hours
      retry: 2,
    })),
  })
}

// Utility function to parse evolution chain
export function parseEvolutionChain(chain: EvolutionChain["chain"]): any[] {
  const evolutions = []
  let current = chain

  while (current) {
    evolutions.push({
      name: current.species.name,
      details: current.evolution_details[0] || null,
    })
    current = current.evolves_to[0]
  }

  return evolutions
}
