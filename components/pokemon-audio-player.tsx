"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Loader2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface PokemonAudioPlayerProps {
  pokemon: any // The full Pokemon object from the API
  gameVersion: string // Current game version
}

export function PokemonAudioPlayer({ pokemon, gameVersion }: PokemonAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Determine which cry to use based on game version
  const shouldUseLegacyCry = (gameVersion: string): boolean => {
    const legacyVersions = [
      "red-blue",
      "yellow",
      "gold-silver",
      "crystal",
      "ruby-sapphire",
      "emerald",
      "firered-leafgreen",
      "diamond-pearl",
      "platinum",
      "heartgold-soulsilver",
    ]
    return legacyVersions.includes(gameVersion)
  }

  // Get the appropriate cry URL based on game version
  const getCryUrl = () => {
    if (!pokemon?.cries) return null

    const useLegacy = shouldUseLegacyCry(gameVersion)

    if (useLegacy && pokemon.cries.legacy) {
      return pokemon.cries.legacy
    } else if (pokemon.cries.latest) {
      return pokemon.cries.latest
    } else if (pokemon.cries.legacy) {
      return pokemon.cries.legacy
    }

    return null
  }

  const cryUrl = getCryUrl()

  // Get cry type for display
  const getCryType = () => {
    if (!cryUrl) return "Unavailable"

    const useLegacy = shouldUseLegacyCry(gameVersion)
    if (useLegacy && pokemon?.cries?.legacy) {
      return "Legacy"
    }
    return "Modern"
  }

  const cryType = getCryType()

  useEffect(() => {
    if (!cryUrl) {
      setHasError(true)
      return
    }

    setIsLoading(true)
    setHasError(false)

    // Create audio element
    const audio = new Audio(cryUrl)
    audio.volume = volume
    audio.crossOrigin = "anonymous" // For CORS

    audio.oncanplaythrough = () => {
      setIsLoaded(true)
      setIsLoading(false)
    }

    audio.onended = () => setIsPlaying(false)

    audio.onerror = (e) => {
      console.error("Audio loading error:", e)
      setHasError(true)
      setIsLoading(false)
      setIsLoaded(false)
    }

    audio.onloadstart = () => setIsLoading(true)

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [cryUrl, volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded || hasError) return

    if (isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Audio play error:", error)
        setHasError(true)
      })
    }

    setIsPlaying(!isPlaying)
  }

  // Don't render if no cry URL is available
  if (!cryUrl) {
    return null
  }

  const getGameDisplayName = (gameVersion: string) => {
    const gameNames: Record<string, string> = {
      "red-blue": "Red/Blue",
      yellow: "Yellow",
      "gold-silver": "Gold/Silver",
      crystal: "Crystal",
      "ruby-sapphire": "Ruby/Sapphire",
      emerald: "Emerald",
      "firered-leafgreen": "FireRed/LeafGreen",
      "diamond-pearl": "Diamond/Pearl",
      platinum: "Platinum",
      "heartgold-soulsilver": "HeartGold/SoulSilver",
      "black-white": "Black/White",
      "black-2-white-2": "Black 2/White 2",
      "x-y": "X/Y",
      "omega-ruby-alpha-sapphire": "Omega Ruby/Alpha Sapphire",
      "sun-moon": "Sun/Moon",
      "ultra-sun-ultra-moon": "Ultra Sun/Ultra Moon",
      "sword-shield": "Sword/Shield",
      "brilliant-diamond-shining-pearl": "Brilliant Diamond/Shining Pearl",
      "legends-arceus": "Legends Arceus",
      "scarlet-violet": "Scarlet/Violet",
    }
    return gameNames[gameVersion] || gameVersion
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={togglePlay}
        disabled={!isLoaded || hasError}
        className="relative"
        onMouseEnter={() => setShowVolumeControl(true)}
        onMouseLeave={() => setShowVolumeControl(false)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        <span className="ml-2">
          {hasError ? "Cry Unavailable" : isLoading ? "Loading..." : `Play Cry (${cryType})`}
        </span>

        {showVolumeControl && !hasError && (
          <div className="absolute left-full ml-2 bg-white p-2 rounded-md shadow-md z-10 flex items-center gap-2 w-32 border">
            <Volume2 className="h-3 w-3 text-gray-500" />
            <Slider
              value={[volume * 100]}
              onValueChange={(values) => setVolume(values[0] / 100)}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        )}
      </Button>

      {/* Game Version Indicator */}
      {cryType === "Legacy" && (
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{getGameDisplayName(gameVersion)} Era</div>
      )}
    </div>
  )
}
