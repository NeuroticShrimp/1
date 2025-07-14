'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

// --- Interfaces ---
interface PokemonCries {
  latest?: string
  legacy?: string
}

interface AudioData {
  blob: Blob
  url: string
}

export interface PokemonCriesData {
  legacy?: AudioData
  modern?: AudioData
}

// --- Blob URL Management ---
// Keep track of created blob URLs to clean them up later
const blobUrlCache = new Map<string, string>()

function manageBlobUrl(key: string, blob: Blob): string {
  // Revoke the old URL if it exists, to prevent memory leaks
  if (blobUrlCache.has(key)) {
    URL.revokeObjectURL(blobUrlCache.get(key)!)
  }

  const newUrl = URL.createObjectURL(blob)
  blobUrlCache.set(key, newUrl)
  return newUrl
}

export function cleanupPokemonCries(pokemonId: number) {
  const legacyKey = `${pokemonId}-legacy`
  const modernKey = `${pokemonId}-modern`
  if (blobUrlCache.has(legacyKey)) {
    URL.revokeObjectURL(blobUrlCache.get(legacyKey)!)
    blobUrlCache.delete(legacyKey)
  }
  if (blobUrlCache.has(modernKey)) {
    URL.revokeObjectURL(blobUrlCache.get(modernKey)!)
    blobUrlCache.delete(modernKey)
  }
}

// --- The Hook ---
export function usePokemonCries(pokemonId: number) {
  const query = useQuery({
    queryKey: ['pokemon-cries', pokemonId],
    queryFn: async (): Promise<PokemonCriesData> => {
      if (!pokemonId) {
        throw new Error('A Pokémon ID must be provided.')
      }

      // 1. Fetch Pokemon data to get the cry URLs
      const pokemonResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
      )
      if (!pokemonResponse.ok) {
        throw new Error('Could not fetch Pokémon data.')
      }
      const pokemonData: { cries: PokemonCries } = await pokemonResponse.json()
      const { latest: modernUrl, legacy: legacyUrl } = pokemonData.cries

      // 2. Fetch both audio files concurrently
      const cryPromises: Promise<[string, Blob | null]>[] = []
      if (legacyUrl) {
        cryPromises.push(
          fetch(legacyUrl)
            .then((res) => res.blob())
            .then((blob) => ['legacy', blob]),
        )
      }
      if (modernUrl) {
        cryPromises.push(
          fetch(modernUrl)
            .then((res) => res.blob())
            .then((blob) => ['modern', blob]),
        )
      }

      const settledCries = await Promise.all(cryPromises)

      // 3. Process the results and create blob URLs
      const criesData: PokemonCriesData = {}
      for (const [type, blob] of settledCries) {
        if (blob && blob.type.startsWith('audio/')) {
          const key = `${pokemonId}-${type}`
          const url = manageBlobUrl(key, blob)
          criesData[type as 'legacy' | 'modern'] = { blob, url }
        }
      }

      if (Object.keys(criesData).length === 0) {
        throw new Error('No valid audio cries found for this Pokémon.')
      }

      return criesData
    },
    enabled: !!pokemonId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 2,
  })

  // Automatically clean up blob URLs when the component using the hook unmounts
  useEffect(() => {
    return () => {
      if (pokemonId) {
        cleanupPokemonCries(pokemonId)
      }
    }
  }, [pokemonId])

  return query
}
