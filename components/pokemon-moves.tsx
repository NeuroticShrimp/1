'use client'

import { Badge } from '@/components/ui/badge'
import { Loader2, Zap } from 'lucide-react'

interface Move {
  name: string
  type: string
  power: number | null
  accuracy: number | null
  machines: any[]
}

interface PokemonMovesProps {
  moves: Move[]
  isLoading: boolean
  getTypeColor: (type: string) => string
  gameVersion: string
}

export function PokemonMoves({
  moves,
  isLoading,
  getTypeColor,
  gameVersion,
}: PokemonMovesProps) {
  const displayVersion =
    gameVersion === 'red-blue'
      ? 'Red/Blue'
      : gameVersion
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('/')

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Zap className="h-5 w-5" />
        TM Moves ({displayVersion})
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </h3>
      <div className="grid gap-2">
        {moves.length > 0 ? (
          moves.map((move, index) => (
            <MoveCard key={index} move={move} getTypeColor={getTypeColor} />
          ))
        ) : isLoading ? (
          <LoadingMoves />
        ) : (
          <p className="text-gray-500">
            No TM moves available for {displayVersion} versions
          </p>
        )}
      </div>
    </div>
  )
}

function MoveCard({
  move,
  getTypeColor,
}: {
  move: Move
  getTypeColor: (type: string) => string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <span className="font-medium capitalize">
          {move.name.replace(/-/g, ' ')}
        </span>
        <Badge
          variant="outline"
          className={`ml-2 ${getTypeColor(move.type)} text-white`}
        >
          {move.type}
        </Badge>
      </div>
      <div className="text-sm text-gray-600">
        {move.power && `Power: ${move.power}`}
        {move.power && move.accuracy && ' • '}
        {move.accuracy && `Accuracy: ${move.accuracy}%`}
      </div>
    </div>
  )
}

function LoadingMoves() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}
