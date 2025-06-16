"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { gameVersions } from "@/lib/constants"

interface GameVersionSelectorProps {
  currentVersion: string
  onVersionChange: (version: string) => void
}

export function GameVersionSelector({ currentVersion, onVersionChange }: GameVersionSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Game Version:</span>
      <Select value={currentVersion} onValueChange={onVersionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {gameVersions.map((version) => (
            <SelectItem key={version.value} value={version.value}>
              {version.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
