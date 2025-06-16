import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PokemonTypeCardProps {
  type: string
  children: React.ReactNode
  className?: string
}

export function PokemonTypeCard({ type, children, className }: PokemonTypeCardProps) {
  const typeStyles: Record<string, string> = {
    fire: "bg-gradient-to-br from-red-400 to-orange-500 text-white",
    water: "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
    grass: "bg-gradient-to-br from-green-400 to-green-600 text-white",
    electric: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-black",
    psychic: "bg-gradient-to-br from-pink-400 to-pink-600 text-white",
    ice: "bg-gradient-to-br from-cyan-300 to-cyan-500 text-black",
    dragon: "bg-gradient-to-br from-purple-500 to-purple-700 text-white",
    dark: "bg-gradient-to-br from-gray-700 to-gray-900 text-white",
    fairy: "bg-gradient-to-br from-pink-300 to-pink-500 text-white",
    normal: "bg-gradient-to-br from-gray-300 to-gray-500 text-black",
    fighting: "bg-gradient-to-br from-red-600 to-red-800 text-white",
    poison: "bg-gradient-to-br from-purple-400 to-purple-600 text-white",
    ground: "bg-gradient-to-br from-yellow-600 to-yellow-800 text-white",
    flying: "bg-gradient-to-br from-indigo-300 to-indigo-500 text-white",
    bug: "bg-gradient-to-br from-lime-400 to-lime-600 text-white",
    rock: "bg-gradient-to-br from-yellow-700 to-yellow-900 text-white",
    ghost: "bg-gradient-to-br from-indigo-600 to-indigo-800 text-white",
    steel: "bg-gradient-to-br from-gray-400 to-gray-600 text-white",
    default: "bg-gradient-to-br from-gray-200 to-gray-400 text-black",
  }

  return (
    <Card className={cn(typeStyles[type] || typeStyles.default, "border-none shadow-lg", className)}>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
