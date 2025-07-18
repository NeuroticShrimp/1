'use client'

import Image from 'next/image'

interface DittoLoaderProps {
  size?: number
  showText?: boolean
}

export function DittoLoader({ size = 48, showText = true }: DittoLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Image
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
        alt="Loading..."
        width={size}
        height={size}
        className="animate-bounce"
      />
      {showText && <p className="text-sm text-gray-500">Loading Pokémon...</p>}
    </div>
  )
}
