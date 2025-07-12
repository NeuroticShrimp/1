'use client'

import { useQuery } from '@tanstack/react-query'

interface PokemonData {
  id: number
  name: string
  sprites: {
    front_default: string
  }
  cries: {
    latest?: string
    legacy?: string
  }
}

interface AudioCacheData {
  blob: Blob
  url: string
  type: 'latest' | 'legacy'
}

// Fetch Pokemon data
export function usePokemon(pokemonName: string) {
  return useQuery({
    queryKey: ['pokemon', pokemonName.toLowerCase()],
    queryFn: async (): Promise<PokemonData> => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`,
      )
      if (!response.ok) {
        throw new Error('Pokemon not found')
      }
      return response.json()
    },
    enabled: !!pokemonName,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

// Fetch and cache audio data as blob
export function usePokemonAudio(
  audioUrl: string | null,
  pokemonId: number,
  type: 'latest' | 'legacy',
) {
  return useQuery({
    queryKey: ['pokemon-audio', pokemonId, type, audioUrl],
    queryFn: async (): Promise<AudioCacheData> => {
      if (!audioUrl) {
        throw new Error('No audio URL provided')
      }

      console.log(`Fetching audio: ${audioUrl}`)

      const response = await fetch(audioUrl, {
        mode: 'cors',
        cache: 'force-cache',
      })

      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio: ${response.status} ${response.statusText}`,
        )
      }

      const blob = await response.blob()

      // Validate that we got audio data
      if (!blob.type.startsWith('audio/') && blob.size === 0) {
        throw new Error('Invalid audio data received')
      }

      const url = URL.createObjectURL(blob)

      return {
        blob,
        url,
        type,
      }
    },
    enabled: !!audioUrl,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  })
}
