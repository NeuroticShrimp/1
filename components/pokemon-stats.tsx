"use client"

interface Stat {
  base_stat: number
  stat: {
    name: string
  }
}

interface PokemonStatsProps {
  stats: Stat[]
}

export function PokemonStats({ stats }: PokemonStatsProps) {
  return (
    <div className="grid gap-3">
      {stats.map((stat) => (
        <StatBar key={stat.stat.name} stat={stat} />
      ))}
    </div>
  )
}

function StatBar({ stat }: { stat: Stat }) {
  const percentage = Math.min((stat.base_stat / 255) * 100, 100)

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 text-sm font-medium capitalize">{stat.stat.name.replace("-", " ")}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>
      <span className="w-12 text-sm font-bold">{stat.base_stat}</span>
    </div>
  )
}
