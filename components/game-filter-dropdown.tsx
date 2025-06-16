"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { gameVersions } from "@/lib/constants"

interface GameFilterDropdownProps {
  currentVersion: string
  onVersionChange: (version: string) => void
}

export function GameFilterDropdown({ currentVersion, onVersionChange }: GameFilterDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-white/80" />
      <Select value={currentVersion} onValueChange={onVersionChange}>
        <SelectTrigger className="w-[180px] bg-white/90">
          <SelectValue placeholder="Select game" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Games</SelectItem>
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
