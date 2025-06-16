import { useQuery } from "@tanstack/react-query"

interface EvolutionTrigger {
  name: string
}

interface EvolutionDetail {
  min_level?: number
  min_happiness?: number
  min_beauty?: number
  min_affection?: number
  time_of_day?: string
  location?: {
    name: string
  }
  held_item?: {
    name: string
  }
  item?: {
    name: string
  }
  known_move?: {
    name: string
  }
  known_move_type?: {
    name: string
  }
  party_species?: {
    name: string
  }
  party_type?: {
    name: string
  }
  relative_physical_stats?: number
  trade_species?: {
    name: string
  }
  trigger: EvolutionTrigger
  turn_upside_down?: boolean
  gender?: number
}

interface EvolutionChainNode {
  species: {
    name: string
    url: string
  }
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionChainNode[]
}

interface SimulationConditions {
  level: number
  happiness: number
  timeOfDay: "day" | "night" | "any"
  location: string
  heldItem: string
  useItem: string
  knownMove: string
  hasPartyMember: string
  gender: "male" | "female" | "any"
  physicalStats: "attack" | "defense" | "equal"
  tradePartner: string
  isUpsideDown: boolean
}

const defaultConditions: SimulationConditions = {
  level: 1,
  happiness: 0,
  timeOfDay: "any",
  location: "",
  heldItem: "",
  useItem: "",
  knownMove: "",
  hasPartyMember: "",
  gender: "any",
  physicalStats: "equal",
  tradePartner: "",
  isUpsideDown: false,
}

export function useEvolutionSimulator(evolutionChainUrl?: string) {
  const { data: evolutionChain } = useQuery({
    queryKey: ["evolution-chain", evolutionChainUrl],
    queryFn: async () => {
      if (!evolutionChainUrl) return null
      const response = await fetch(evolutionChainUrl)
      return response.json()
    },
    enabled: !!evolutionChainUrl,
    staleTime: 1000 * 60 * 20,
  })

  const checkEvolutionPossible = (details: EvolutionDetail, conditions: SimulationConditions): boolean => {
    // Level requirement
    if (details.min_level && conditions.level < details.min_level) return false

    // Happiness requirement
    if (details.min_happiness && conditions.happiness < details.min_happiness) return false

    // Time of day requirement
    if (details.time_of_day && conditions.timeOfDay !== "any" && details.time_of_day !== conditions.timeOfDay)
      return false

    // Location requirement
    if (details.location && !conditions.location.includes(details.location.name)) return false

    // Held item requirement
    if (details.held_item && !conditions.heldItem.includes(details.held_item.name)) return false

    // Use item requirement
    if (details.item && !conditions.useItem.includes(details.item.name)) return false

    // Known move requirement
    if (details.known_move && !conditions.knownMove.includes(details.known_move.name)) return false

    // Party member requirement
    if (details.party_species && !conditions.hasPartyMember.includes(details.party_species.name)) return false

    // Trade requirement
    if (details.trigger.name === "trade" && !conditions.tradePartner) return false

    // Gender requirement
    if (details.gender !== undefined) {
      if (details.gender === 1 && conditions.gender !== "female") return false
      if (details.gender === 2 && conditions.gender !== "male") return false
    }

    // Physical stats requirement
    if (details.relative_physical_stats !== undefined) {
      if (details.relative_physical_stats === 1 && conditions.physicalStats !== "attack") return false
      if (details.relative_physical_stats === -1 && conditions.physicalStats !== "defense") return false
      if (details.relative_physical_stats === 0 && conditions.physicalStats !== "equal") return false
    }

    // Upside down requirement (for Inkay -> Malamar)
    if (details.turn_upside_down && !conditions.isUpsideDown) return false

    return true
  }

  const simulateEvolution = (conditions: SimulationConditions) => {
    if (!evolutionChain) return []

    const results: Array<{
      from: string
      to: string
      possible: boolean
      requirements: string[]
      missingRequirements: string[]
    }> = []

    const traverseChain = (node: EvolutionChainNode) => {
      for (const evolution of node.evolves_to) {
        for (const details of evolution.evolution_details) {
          const possible = checkEvolutionPossible(details, conditions)
          const requirements = formatEvolutionRequirements(details)
          const missingRequirements = possible ? [] : getMissingRequirements(details, conditions)

          results.push({
            from: node.species.name,
            to: evolution.species.name,
            possible,
            requirements,
            missingRequirements,
          })
        }
        traverseChain(evolution)
      }
    }

    traverseChain(evolutionChain.chain)
    return results
  }

  const formatEvolutionRequirements = (details: EvolutionDetail): string[] => {
    const requirements: string[] = []

    if (details.min_level) requirements.push(`Level ${details.min_level}`)
    if (details.min_happiness) requirements.push(`Happiness ${details.min_happiness}`)
    if (details.time_of_day) requirements.push(`${details.time_of_day} time`)
    if (details.location) requirements.push(`At ${details.location.name.replace("-", " ")}`)
    if (details.held_item) requirements.push(`Hold ${details.held_item.name.replace("-", " ")}`)
    if (details.item) requirements.push(`Use ${details.item.name.replace("-", " ")}`)
    if (details.known_move) requirements.push(`Know ${details.known_move.name.replace("-", " ")}`)
    if (details.party_species) requirements.push(`${details.party_species.name} in party`)
    if (details.trigger.name === "trade") requirements.push("Trade")
    if (details.gender === 1) requirements.push("Female only")
    if (details.gender === 2) requirements.push("Male only")
    if (details.relative_physical_stats === 1) requirements.push("Attack > Defense")
    if (details.relative_physical_stats === -1) requirements.push("Defense > Attack")
    if (details.relative_physical_stats === 0) requirements.push("Attack = Defense")
    if (details.turn_upside_down) requirements.push("Turn device upside down")

    return requirements
  }

  const getMissingRequirements = (details: EvolutionDetail, conditions: SimulationConditions): string[] => {
    const missing: string[] = []

    if (details.min_level && conditions.level < details.min_level) {
      missing.push(`Need level ${details.min_level} (currently ${conditions.level})`)
    }
    if (details.min_happiness && conditions.happiness < details.min_happiness) {
      missing.push(`Need happiness ${details.min_happiness} (currently ${conditions.happiness})`)
    }
    if (details.time_of_day && conditions.timeOfDay !== "any" && details.time_of_day !== conditions.timeOfDay) {
      missing.push(`Must be ${details.time_of_day} time`)
    }
    if (details.location && !conditions.location.includes(details.location.name)) {
      missing.push(`Must be at ${details.location.name.replace("-", " ")}`)
    }
    if (details.held_item && !conditions.heldItem.includes(details.held_item.name)) {
      missing.push(`Must hold ${details.held_item.name.replace("-", " ")}`)
    }
    if (details.item && !conditions.useItem.includes(details.item.name)) {
      missing.push(`Must use ${details.item.name.replace("-", " ")}`)
    }
    if (details.known_move && !conditions.knownMove.includes(details.known_move.name)) {
      missing.push(`Must know ${details.known_move.name.replace("-", " ")}`)
    }
    if (details.party_species && !conditions.hasPartyMember.includes(details.party_species.name)) {
      missing.push(`Need ${details.party_species.name} in party`)
    }
    if (details.trigger.name === "trade" && !conditions.tradePartner) {
      missing.push("Need trading partner")
    }
    if (details.turn_upside_down && !conditions.isUpsideDown) {
      missing.push("Must turn device upside down")
    }

    return missing
  }

  return {
    simulateEvolution,
    defaultConditions,
    evolutionChain: evolutionChain?.chain,
  }
}
