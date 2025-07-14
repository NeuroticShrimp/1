'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  usePokemonCries,
  type PokemonCriesData,
} from '@/hooks/use-pokemon-cries'

// --- Inner Player Component (Handles actual playback) ---
interface PokemonAudioPlayerInnerProps {
  audioData: PokemonCriesData[keyof PokemonCriesData]
  cryType: 'legacy' | 'modern'
}

function PokemonAudioPlayerInner({
  audioData,
  cryType,
}: PokemonAudioPlayerInnerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioData) return

    const audio = new Audio(audioData.url)
    audio.volume = volume
    audio.crossOrigin = 'anonymous'

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)
    audioRef.current = audio

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
    }
  }, [audioData, volume])

  const togglePlay = async () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (err) {
        console.error('Failed to play audio:', err)
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={togglePlay}
          className="flex items-center gap-2 bg-transparent"
        >
          {isPlaying ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          <span>Play Cry ({cryType === 'legacy' ? 'Legacy' : 'Modern'})</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
        <Volume2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <div className="flex-1">
          <Slider
            value={[volume * 100]}
            onValueChange={(values) => setVolume(values[0] / 100)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        <span className="text-sm text-gray-500 min-w-[3ch] text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  )
}

// --- Main Component (Handles state and data fetching) ---
interface PokemonAudioPlayerProps {
  pokemon: {
    id: number
  }
}

export function PokemonAudioPlayer({ pokemon }: PokemonAudioPlayerProps) {
  const {
    data: criesData,
    isLoading,
    error,
    refetch,
  } = usePokemonCries(pokemon.id)

  const defaultCryType = criesData?.modern ? 'modern' : 'legacy'
  const [selectedCryType, setSelectedCryType] = useState<'legacy' | 'modern'>(
    defaultCryType,
  )

  // Update the selected cry type if the default changes (e.g., after data loads)
  useEffect(() => {
    setSelectedCryType(criesData?.modern ? 'modern' : 'legacy')
  }, [criesData])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading Pokémon Cries...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const bothCryTypesAvailable = !!(criesData?.legacy && criesData?.modern)
  const selectedAudioData = criesData?.[selectedCryType]

  return (
    <div className="w-full max-w-md space-y-4">
      {bothCryTypesAvailable && (
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
          <span className="text-sm font-medium text-gray-700">Cry Type:</span>
          <div className="flex gap-1">
            <Button
              variant={selectedCryType === 'legacy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCryType('legacy')}
              className="text-xs h-7"
            >
              Legacy
            </Button>
            <Button
              variant={selectedCryType === 'modern' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCryType('modern')}
              className="text-xs h-7"
            >
              Modern
            </Button>
          </div>
        </div>
      )}

      {selectedAudioData ? (
        <PokemonAudioPlayerInner
          key={selectedCryType}
          audioData={selectedAudioData}
          cryType={selectedCryType}
        />
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Selected cry type is not available for this Pokémon.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
