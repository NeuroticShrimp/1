'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { DittoLoader } from './ditto-loader'

interface PokemonImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function PokemonImage({
  src,
  alt,
  width,
  height,
  className = '',
}: PokemonImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Reset state when src changes to allow for re-loading
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const showLoader = isLoading || hasError

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      {/* Ditto Loader - shown while loading or on error */}
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center">
          <DittoLoader size={Math.min(width, height) * 0.8} />
        </div>
      )}

      {/* 
        The Image component is always rendered so that the onLoad and onError events can be triggered.
        We control its visibility with opacity.
        When an error occurs, the loader is shown, and this image is hidden.
      */}
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        width={width}
        height={height}
        className={`pixelated transition-opacity duration-300 ${showLoader ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        priority
      />
    </div>
  )
}
