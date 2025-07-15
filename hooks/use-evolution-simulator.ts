import { useQuery } from '@tanstack/react-query'

// --- Interfaces from PokeAPI (for context) ---
interface EvolutionTrigger {
  name: string
}

interface EvolutionDetail {
  min_level?: number
  min_happiness?: number
  time_of_day?: string
  location?: { name: string }
  held_item?: { name: string }
  item?: { name: string }
  known_move?: { name: string }
  party_species?: { name: string }
  relative_physical_stats?: number
  trade_species?: { name: string }
  trigger: EvolutionTrigger
  turn_upside_down?: boolean
  gender?: number
}

interface EvolutionChainNode {
  species: { name: string; url: string }
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionChainNode[]
}

// --- SHARED TYPES (NOW EXPORTED) ---

// This is the strict type the simulation function requires.
// Every property is required.
export interface SimulationConditions {
  level: number
  happiness: number
  timeOfDay: 'day' | 'night' | 'any'
  location: string
  heldItem: string
  useItem: string
  knownMove: string
  hasPartyMember: string
  gender: 'male' | 'female' | 'any'
  physicalStats: 'attack' | 'defense' | 'equal'
  tradePartner: string
  isUpsideDown: boolean
}

// This is the single source of truth for default values.
// It perfectly matches the SimulationConditions interface.
export const defaultConditions: SimulationConditions = {
  level: 1,
  happiness: 0,
  timeOfDay: 'any',
  location: '',
  heldItem: '',
  useItem: '',
  knownMove: '',
  hasPartyMember: '',
  gender: 'any',
  physicalStats: 'equal',
  tradePartner: '',
  isUpsideDown: false,
}

// --- THE HOOK LOGIC ---

export function useEvolutionSimulator(evolutionChainUrl?: string) {
  const { data: evolutionChain } = useQuery<{ chain: EvolutionChainNode }>({
    queryKey: ['evolution-chain', evolutionChainUrl],
    queryFn: async () => {
      if (!evolutionChainUrl) return null
      const response = await fetch(evolutionChainUrl)
      return response.json()
    },
    enabled: !!evolutionChainUrl,
    staleTime: 1000 * 60 * 20,
  })

  const checkEvolutionPossible = (
    details: EvolutionDetail,
    conditions: SimulationConditions,
  ): boolean => {
    if (details.min_level && conditions.level < details.min_level) return false
    if (details.min_happiness && conditions.happiness < details.min_happiness)
      return false
    if (
      details.time_of_day &&
      conditions.timeOfDay !== 'any' &&
      details.time_of_day !== conditions.timeOfDay
    )
      return false
    if (
      details.location &&
      !conditions.location.includes(details.location.name)
    )
      return false
    if (
      details.held_item &&
      !conditions.heldItem.includes(details.held_item.name)
    )
      return false
    if (details.item && !conditions.useItem.includes(details.item.name))
      return false
    if (
      details.known_move &&
      !conditions.knownMove.includes(details.known_move.name)
    )
      return false
    if (
      details.party_species &&
      !conditions.hasPartyMember.includes(details.party_species.name)
    )
      return false
    if (details.trigger.name === 'trade' && !conditions.tradePartner)
      return false
    if (details.gender !== undefined) {
      if (details.gender === 1 && conditions.gender !== 'female') return false
      if (details.gender === 2 && conditions.gender !== 'male') return false
    }
    if (details.relative_physical_stats !== undefined) {
      if (
        details.relative_physical_stats === 1 &&
        conditions.physicalStats !== 'attack'
      )
        return false
      if (
        details.relative_physical_stats === -1 &&
        conditions.physicalStats !== 'defense'
      )
        return false
      if (
        details.relative_physical_stats === 0 &&
        conditions.physicalStats !== 'equal'
      )
        return false
    }
    if (details.turn_upside_down && !conditions.isUpsideDown) return false
    return true
  }

  const simulateEvolution = (conditions: SimulationConditions) => {
    if (!evolutionChain) return []
    const results: Array<{ from: string; to: string; requirements: string[] }> =
      []
    const traverseChain = (node: EvolutionChainNode) => {
      for (const evolution of node.evolves_to) {
        for (const details of evolution.evolution_details) {
          if (checkEvolutionPossible(details, conditions)) {
            results.push({
              from: node.species.name,
              to: evolution.species.name,
              requirements: formatEvolutionRequirements(details),
            })
          }
        }
        traverseChain(evolution)
      }
    }
    traverseChain(evolutionChain.chain)
    return results
  }

  const formatEvolutionRequirements = (details: EvolutionDetail): string[] => {
    const requirements: string[] = []
    if (details.min_level) requirements.push(`Lvl ${details.min_level}`)
    if (details.min_happiness)
      requirements.push(`Happiness ${details.min_happiness}`)
    if (details.time_of_day) requirements.push(`${details.time_of_day}`)
    if (details.location)
      requirements.push(`at ${details.location.name.replace(/-/g, ' ')}`)
    if (details.held_item)
      requirements.push(`hold ${details.held_item.name.replace(/-/g, ' ')}`)
    if (details.item)
      requirements.push(`use ${details.item.name.replace(/-/g, ' ')}`)
    if (details.known_move)
      requirements.push(`knows ${details.known_move.name.replace(/-/g, ' ')}`)
    if (details.party_species)
      requirements.push(`with ${details.party_species.name} in party`)
    if (details.trigger.name === 'trade') requirements.push('Trade')
    if (details.gender === 1) requirements.push('Female')
    if (details.gender === 2) requirements.push('Male')
    if (details.relative_physical_stats === 1) requirements.push('Atk > Def')
    if (details.relative_physical_stats === -1) requirements.push('Def > Atk')
    if (details.turn_upside_down) requirements.push('Upside down')
    return requirements
  }

  return {
    simulateEvolution,
    defaultConditions,
    evolutionChain: evolutionChain?.chain,
  }
}
