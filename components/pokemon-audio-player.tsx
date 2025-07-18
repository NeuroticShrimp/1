'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { usePokemonCries } from '@/hooks/use-pokemon-cries'

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

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [selectedCryType, setSelectedCryType] = useState<'legacy' | 'modern'>(
    'legacy',
  )

  const selectedAudioUrl = criesData?.[selectedCryType]?.url

  useEffect(() => {
    if (criesData) {
      setSelectedCryType(criesData.modern ? 'modern' : 'legacy')
    }
  }, [criesData])

  useEffect(() => {
    if (!selectedAudioUrl) return

    const audio = new Audio(selectedAudioUrl)
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
    }
  }, [selectedAudioUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

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

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0] / 100
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-9 items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Cry</span>
      </div>
    )
  }

  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-9 items-center gap-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Error</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{error.message || 'Failed to load cry'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!selectedAudioUrl) {
    return (
      <div className="flex h-9 items-center gap-2 text-sm text-gray-500">
        <AlertCircle className="h-4 w-4" />
        <span>No Cry</span>
      </div>
    )
  }

  const bothCryTypesAvailable = !!(criesData?.legacy && criesData?.modern)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={togglePlay}
        className="h-9 w-9 flex-shrink-0 bg-transparent"
        disabled={!selectedAudioUrl}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="sr-only">Play/Pause Cry</span>
      </Button>

      {bothCryTypesAvailable && (
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={selectedCryType}
          onValueChange={(value: 'legacy' | 'modern') => {
            if (value) setSelectedCryType(value)
          }}
          className="h-9 bg-white"
        >
          <ToggleGroupItem value="legacy" aria-label="Legacy cry">
            L
          </ToggleGroupItem>
          <ToggleGroupItem value="modern" aria-label="Modern cry">
            M
          </ToggleGroupItem>
        </ToggleGroup>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 flex-shrink-0 bg-transparent"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            <span className="sr-only">Volume control</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
