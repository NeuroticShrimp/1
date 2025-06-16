"use client"

import { Loader2, MapPin } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface Encounter {
  location_area: {
    name: string
    url: string
  }
  version_details: Array<{
    max_chance: number
    version: {
      name: string
    }
  }>
}

interface PokemonLocationsProps {
  encounters: Encounter[]
  isLoading: boolean
  gameVersion: string
}

export function PokemonLocations({ encounters, isLoading, gameVersion }: PokemonLocationsProps) {
  const displayVersion =
    gameVersion === "red-blue"
      ? "Red/Blue"
      : gameVersion
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("/")

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Encounter Locations ({displayVersion}){isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </h3>
      <div className="grid gap-2">
        {encounters.length > 0 ? (
          encounters.map((encounter, index) => (
            <LocationCard key={index} encounter={encounter} gameVersion={gameVersion} />
          ))
        ) : isLoading ? (
          <LoadingLocations />
        ) : (
          <p className="text-gray-500">No encounter locations found for {displayVersion} versions</p>
        )}
      </div>
    </div>
  )
}

function LocationCard({ encounter, gameVersion }: { encounter: Encounter; gameVersion: string }) {
  // Extract location ID from URL
  const locationId = encounter.location_area.url.split("/").filter(Boolean).pop()

  // Fetch location data to get more details
  const { data: locationData } = useQuery({
    queryKey: ["location-area", locationId],
    queryFn: async () => {
      const response = await fetch(encounter.location_area.url)
      return response.json()
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  // Get parent location for possible image
  const { data: parentLocation } = useQuery({
    queryKey: ["location", locationData?.location?.name],
    queryFn: async () => {
      if (!locationData?.location?.url) return null
      const response = await fetch(locationData.location.url)
      return response.json()
    },
    enabled: !!locationData?.location?.url,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  // Format version details based on game version
  const versionDetails = encounter.version_details
    .filter((detail) => {
      if (gameVersion === "red-blue") {
        return detail.version.name === "red" || detail.version.name === "blue"
      }
      return detail.version.name === gameVersion.split("-")[0] || detail.version.name === gameVersion.split("-")[1]
    })
    .map((detail) => `${detail.version.name}: ${detail.max_chance}% chance`)
    .join(", ")

  // Get region name if available
  const regionName = parentLocation?.region?.name
    ? `(${parentLocation.region.name.charAt(0).toUpperCase() + parentLocation.region.name.slice(1)} region)`
    : ""

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="font-medium capitalize">{encounter.location_area.name.replace(/-/g, " ")}</div>
          <div className="text-sm text-gray-600 mt-1">{versionDetails}</div>
          {regionName && <div className="text-xs text-gray-500 mt-1 capitalize">{regionName}</div>}
        </div>
        {parentLocation?.id && (
          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {/* We don't have direct location images in PokeAPI, so we'll use a placeholder based on region */}
            <img
              src={`/placeholder.svg?height=64&width=64&query=pokemon ${parentLocation.region?.name || ""} landscape`}
              alt={encounter.location_area.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingLocations() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}
