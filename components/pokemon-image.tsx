"use client"

import { useState } from "react"
import Image from "next/image"
import { DittoLoader } from "./ditto-loader"

interface PokemonImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function PokemonImage({ src, alt, width, height, className = "" }: PokemonImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Default Pikachu image from the official Pokemon API
  const pikachuFallbackImage =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width, height }}>
      {/* Ditto Loader - shown while loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <DittoLoader size={Math.min(width, height) * 0.8} />
        </div>
      )}

      {/* Original Pokemon Image */}
      <Image
        src={hasError ? pikachuFallbackImage : src || "/placeholder.svg"}
        alt={hasError ? "Pikachu (fallback)" : alt}
        width={width}
        height={height}
        className={`pixelated transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={handleLoad}
        onError={handleError}
        priority
      />

      {/* Error message - small notification that we're showing Pikachu instead */}
      {hasError && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-xs py-1 px-2 text-center rounded-b-md opacity-80">
          Showing Pikachu instead
        </div>
      )}
    </div>
  )
}
