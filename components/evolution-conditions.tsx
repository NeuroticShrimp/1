'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Zap, ArrowRight } from 'lucide-react'
import {
  useEvolutionSimulator,
  type SimulationConditions,
} from '@/hooks/use-evolution-simulator'

interface EvolutionConditionsProps {
  evolutionChainUrl?: string
  currentPokemon: string
}

interface Scenario {
  id: string
  name: string
  description: string
  icon: string
  conditions: SimulationConditions
}

export function EvolutionConditions({
  evolutionChainUrl,
  currentPokemon,
}: EvolutionConditionsProps) {
  const { simulateEvolution, defaultConditions } =
    useEvolutionSimulator(evolutionChainUrl)

  // The state now uses the imported `SimulationConditions` type and is initialized with the hook's defaults.
  const [conditions, setConditions] =
    useState<SimulationConditions>(defaultConditions)
  const [activeScenario, setActiveScenario] = useState<string>('early-game')

  // Scenarios now use `...defaultConditions` to ensure all properties are set correctly.
  const scenarios: Scenario[] = [
    {
      id: 'early-game',
      name: 'Early Game',
      description: 'Level 16, basic happiness, daytime play',
      icon: '🌅',
      conditions: {
        ...defaultConditions,
        level: 16,
        happiness: 50,
        timeOfDay: 'day',
      },
    },
    {
      id: 'mid-game',
      name: 'Mid Game',
      description: 'Level 36, good happiness, has items',
      icon: '⚡',
      conditions: {
        ...defaultConditions,
        level: 36,
        happiness: 150,
        heldItem: 'everstone',
      },
    },
    {
      id: 'late-game',
      name: 'Late Game',
      description: 'Level 55, max happiness, trading available',
      icon: '🌙',
      conditions: {
        ...defaultConditions,
        level: 55,
        happiness: 255,
        timeOfDay: 'night',
        tradePartner: 'friend',
        hasPartyMember: 'remoraid',
      },
    },
    {
      id: 'competitive',
      name: 'Competitive',
      description: 'Level 50, optimized stats and moves',
      icon: '🏆',
      conditions: {
        ...defaultConditions,
        level: 50,
        happiness: 255,
        physicalStats: 'attack',
        knownMove: 'ancient-power',
      },
    },
    {
      id: 'special-location',
      name: 'Special Location',
      description: 'Location-based evolutions',
      icon: '🗺️',
      conditions: {
        ...defaultConditions,
        level: 30,
        location: 'magnetic-field',
      },
    },
    {
      id: 'unique-method',
      name: 'Unique Method',
      description: 'Special evolution requirements',
      icon: '🔄',
      conditions: {
        ...defaultConditions,
        level: 25,
        gender: 'female',
        isUpsideDown: true,
      },
    },
  ]

  const loadScenario = (scenarioId: string) => {
    setActiveScenario(scenarioId)
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      setConditions(scenario.conditions)
    }
  }

  const currentScenario =
    scenarios.find((s) => s.id === activeScenario) || scenarios[0]

  // This call is now type-safe and should not produce an error.
  const results = simulateEvolution(conditions)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Evolution Conditions
          </CardTitle>
          <p className="text-sm text-gray-600">
            Explore different evolution contexts for {currentPokemon}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-colors ${
                  activeScenario === scenario.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => loadScenario(scenario.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{scenario.icon}</span>
                    <div className="truncate">
                      <h4 className="font-medium text-sm">{scenario.name}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{currentScenario.icon}</span>
              <div>
                <h3 className="font-semibold">{currentScenario.name}</h3>
                <p className="text-sm text-gray-600">
                  {currentScenario.description}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {conditions.level > 1 && (
                <Badge variant="outline" className="text-xs">
                  Level {conditions.level}
                </Badge>
              )}
              {conditions.happiness > 0 && (
                <Badge variant="outline" className="text-xs">
                  Happiness {conditions.happiness}
                </Badge>
              )}
              {conditions.timeOfDay !== 'any' && (
                <Badge variant="outline" className="text-xs">
                  Time: {conditions.timeOfDay}
                </Badge>
              )}
              {conditions.location && (
                <Badge variant="outline" className="text-xs">
                  Location: {conditions.location}
                </Badge>
              )}
              {conditions.gender !== 'any' && (
                <Badge variant="outline" className="text-xs">
                  Gender: {conditions.gender}
                </Badge>
              )}
              {conditions.isUpsideDown && (
                <Badge variant="outline" className="text-xs">
                  Upside Down
                </Badge>
              )}
              {conditions.heldItem && (
                <Badge variant="outline" className="text-xs">
                  Holding: {conditions.heldItem}
                </Badge>
              )}
              {conditions.useItem && (
                <Badge variant="outline" className="text-xs">
                  Using: {conditions.useItem}
                </Badge>
              )}
              {conditions.knownMove && (
                <Badge variant="outline" className="text-xs">
                  Knows: {conditions.knownMove}
                </Badge>
              )}
              {conditions.hasPartyMember && (
                <Badge variant="outline" className="text-xs">
                  Party: {conditions.hasPartyMember}
                </Badge>
              )}
              {conditions.tradePartner && (
                <Badge variant="outline" className="text-xs">
                  Trading
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Evolution Requirements</h3>
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((evolution, index) => (
                  <Card key={index} className="border-gray-200 bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium capitalize">
                          {evolution.from}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <span className="font-medium capitalize">
                          {evolution.to}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {evolution.requirements.map(
                          (req: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {req}
                            </Badge>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No evolution data available for {currentPokemon}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
