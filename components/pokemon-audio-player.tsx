'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePokemonAudio } from '@/hooks/use-pokemon-audio'

interface PokemonAudioPlayerProps {
  pokemon: any
  gameVersion: string
}

export function PokemonAudioPlayer({
  pokemon,
  gameVersion,
}: PokemonAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentBlobUrlRef = useRef<string | null>(null)

  // Determine which cry to use based on game version
  const shouldUseLegacyCry = (gameVersion: string): boolean => {
    const legacyVersions = [
      'red-blue',
      'yellow',
      'gold-silver',
      'crystal',
      'ruby-sapphire',
      'emerald',
      'firered-leafgreen',
      'diamond-pearl',
      'platinum',
      'heartgold-soulsilver',
    ]
    return legacyVersions.includes(gameVersion)
  }

  // Get the appropriate cry URL and type
  const getCryInfo = () => {
    if (!pokemon?.cries) return { url: null, type: 'latest' as const }

    const useLegacy = shouldUseLegacyCry(gameVersion)

    if (useLegacy && pokemon.cries.legacy) {
      return { url: pokemon.cries.legacy, type: 'legacy' as const }
    } else if (pokemon.cries.latest) {
      return { url: pokemon.cries.latest, type: 'latest' as const }
    } else if (pokemon.cries.legacy) {
      return { url: pokemon.cries.legacy, type: 'legacy' as const }
    }

    return { url: null, type: 'latest' as const }
  }

  const { url: cryUrl, type: cryType } = getCryInfo()

  // Use TanStack Query to fetch and cache audio
  const {
    data: audioData,
    isLoading,
    error: queryError,
    refetch,
  } = usePokemonAudio(cryUrl, pokemon?.id, cryType)

  // Setup audio element when audioData changes
  useEffect(() => {
    if (!audioData) {
      setHasError(false)
      setErrorMessage('')
      return
    }

    try {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }

      // Clean up previous blob URL
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
        currentBlobUrlRef.current = null
      }

      // Create new audio element with cached blob URL
      const audio = new Audio(audioData.url)
      audio.preload = 'auto'

      // Set initial volume after a brief delay to ensure audio is ready
      setTimeout(() => {
        try {
          audio.volume = volume
        } catch (error) {
          console.warn('Failed to set initial volume:', error)
        }
      }, 10)

      // Store the blob URL for cleanup
      currentBlobUrlRef.current = audioData.url

      const handleEnded = () => {
        setIsPlaying(false)
      }

      const handleError = (e: Event) => {
        console.error('Audio playback error:', e)
        const target = e.target as HTMLAudioElement
        const error = target.error

        let errorMsg = 'Audio playback failed'
        if (error) {
          switch (error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMsg = 'Audio playback was aborted'
              break
            case MediaError.MEDIA_ERR_NETWORK:
              errorMsg = 'Network error during playback'
              break
            case MediaError.MEDIA_ERR_DECODE:
              errorMsg = 'Audio format not supported'
              break
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = 'Audio source not supported'
              break
          }
        }

        setHasError(true)
        setErrorMessage(errorMsg)
        setIsPlaying(false)
      }

      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)

      audioRef.current = audio
      setHasError(false)
      setErrorMessage('')

      console.log(
        `Audio loaded from cache: ${audioData.type} cry for Pokemon ${pokemon.id}`,
      )
    } catch (error) {
      console.error('Error setting up audio:', error)
      setHasError(true)
      setErrorMessage('Failed to setup audio player')
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [audioData, pokemon?.id]) // Remove volume from dependencies

  // Update volume when it changes (with error handling)
  useEffect(() => {
    if (audioRef.current) {
      try {
        // Check if audio element is in a valid state
        if (
          audioRef.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ||
          audioRef.current.readyState === HTMLMediaElement.HAVE_NOTHING
        ) {
          audioRef.current.volume = volume
        }
      } catch (error) {
        console.warn('Failed to set volume:', error)
        // Don't set error state for volume issues, just log it
      }
    }
  }, [volume])

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      setHasError(true)
      setErrorMessage(queryError.message || 'Failed to load audio')
    }
  }, [queryError])

  const togglePlay = async () => {
    if (!audioRef.current || hasError) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Audio play error:', error)
      setHasError(true)
      setErrorMessage('Failed to play audio')
    }
  }

  const handleRetry = () => {
    setHasError(false)
    setErrorMessage('')
    refetch()
  }

  const getGameDisplayName = (gameVersion: string) => {
    const gameNames: Record<string, string> = {
      'red-blue': 'Red/Blue',
      yellow: 'Yellow',
      'gold-silver': 'Gold/Silver',
      crystal: 'Crystal',
      'ruby-sapphire': 'Ruby/Sapphire',
      emerald: 'Emerald',
      'firered-leafgreen': 'FireRed/LeafGreen',
      'diamond-pearl': 'Diamond/Pearl',
      platinum: 'Platinum',
      'heartgold-soulsilver': 'HeartGold/SoulSilver',
      'black-white': 'Black/White',
      'black-2-white-2': 'Black 2/White 2',
      'x-y': 'X/Y',
      'omega-ruby-alpha-sapphire': 'Omega Ruby/Alpha Sapphire',
      'sun-moon': 'Sun/Moon',
      'ultra-sun-ultra-moon': 'Ultra Sun/Ultra Moon',
      'sword-shield': 'Sword/Shield',
      'brilliant-diamond-shining-pearl': 'Brilliant Diamond/Shining Pearl',
      'legends-arceus': 'Legends Arceus',
      'scarlet-violet': 'Scarlet/Violet',
    }
    return gameNames[gameVersion] || gameVersion
  }

  // Don't render if no cry URL is available
  if (!cryUrl) {
    return (
      <Alert className="w-full max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No audio available for this Pokémon in{' '}
          {getGameDisplayName(gameVersion)}
        </AlertDescription>
      </Alert>
    )
  }

  const isReady = audioData && !isLoading && !hasError

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={togglePlay}
          disabled={!isReady}
          className="flex items-center gap-2 bg-transparent"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasError ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : isPlaying ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          <span>
            {hasError
              ? 'Error'
              : isLoading
                ? 'Loading...'
                : `Play Cry (${cryType === 'legacy' ? 'Legacy' : 'Modern'})`}
          </span>
        </Button>

        {/* Game Version Indicator */}
        {cryType === 'legacy' && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {getGameDisplayName(gameVersion)} Era
          </div>
        )}

        {/* Retry Button */}
        {hasError && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>

      {/* Always Visible Volume Control */}
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
        <Volume2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <div className="flex-1">
          <Slider
            value={[volume * 100]}
            onValueChange={(values) => setVolume(values[0] / 100)}
            max={100}
            step={1}
            className="w-full"
            disabled={!isReady}
          />
        </div>
        <span className="text-sm text-gray-500 min-w-[3ch] text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Error Message */}
      {hasError && errorMessage && (
        <Alert className="w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {errorMessage}
            {cryUrl && (
              <div className="mt-1 text-xs text-gray-500 break-all">
                URL: {cryUrl}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Cache Status */}
      {audioData && (
        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          ✓ Audio cached ({audioData.type})
        </div>
      )}

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 space-y-1 bg-gray-50 p-2 rounded">
          <div>URL: {cryUrl}</div>
          <div>Type: {cryType}</div>
          <div>Game: {getGameDisplayName(gameVersion)}</div>
          <div>
            Status:{' '}
            {isLoading
              ? 'Loading'
              : isReady
                ? 'Ready'
                : hasError
                  ? 'Error'
                  : 'Idle'}
          </div>
          <div>Cached: {audioData ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  )
}
