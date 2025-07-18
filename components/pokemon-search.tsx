'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Clock, Loader2, X } from 'lucide-react'
import { usePokemonSuggestions } from '@/hooks/use-pokemon-suggestions'

interface PokemonSearchProps {
  value: string
  onChange: (value: string) => void
  onSearch: (pokemon: string) => void
  recentSearches: string[]
  onRecentSearch: (pokemon: string) => void
  onClearRecent?: () => void
}

export function PokemonSearch({
  value,
  onChange,
  onSearch,
  recentSearches,
  onRecentSearch,
  onClearRecent,
}: PokemonSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { suggestions, isLoading, hasQuery } = usePokemonSuggestions(value)

  const allOptions = hasQuery ? suggestions : recentSearches.slice(0, 5)
  const showDropdown = isOpen && (allOptions.length > 0 || isLoading)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
    setSelectedIndex(-1)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'Enter') {
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < allOptions.length - 1 ? prev + 1 : prev,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < allOptions.length) {
          selectOption(allOptions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const selectOption = (pokemon: string) => {
    onChange('')
    onSearch(pokemon)
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value.trim())
      onChange('')
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  const handleRecentSelect = (pokemon: string) => {
    onRecentSearch(pokemon)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter Pokémon name or ID..."
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="bg-white/90 pr-8"
            autoComplete="off"
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto">
          <CardContent className="p-2">
            {isLoading && hasQuery ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Searching...</span>
              </div>
            ) : (
              <>
                {hasQuery ? (
                  <SuggestionsList
                    suggestions={suggestions}
                    selectedIndex={selectedIndex}
                    onSelect={selectOption}
                    query={value}
                  />
                ) : (
                  <RecentSearchesList
                    searches={recentSearches.slice(0, 5)}
                    selectedIndex={selectedIndex}
                    onSelect={handleRecentSelect}
                    onClear={onClearRecent}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface SuggestionsListProps {
  suggestions: string[]
  selectedIndex: number
  onSelect: (pokemon: string) => void
  query: string
}

function SuggestionsList({
  suggestions,
  selectedIndex,
  onSelect,
  query,
}: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return (
      <div className="py-2 text-center text-sm text-gray-500">
        No Pokémon found matching "{query}"
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500 px-2 py-1 border-b">
        Suggestions
      </div>
      {suggestions.map((pokemon, index) => (
        <SuggestionItem
          key={pokemon}
          pokemon={pokemon}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(pokemon)}
          query={query}
        />
      ))}
    </div>
  )
}

interface SuggestionItemProps {
  pokemon: string
  isSelected: boolean
  onClick: () => void
  query: string
}

function SuggestionItem({
  pokemon,
  isSelected,
  onClick,
  query,
}: SuggestionItemProps) {
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi',
    )
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-800 rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div
      className={`px-2 py-2 rounded cursor-pointer transition-colors capitalize ${
        isSelected ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {highlightMatch(pokemon, query)}
    </div>
  )
}

interface RecentSearchesListProps {
  searches: string[]
  selectedIndex: number
  onSelect: (pokemon: string) => void
  onClear?: () => void
}

function RecentSearchesList({
  searches,
  selectedIndex,
  onSelect,
  onClear,
}: RecentSearchesListProps) {
  if (searches.length === 0) {
    return (
      <div className="py-2 text-center text-sm text-gray-500">
        No recent searches
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1 border-b">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          Recent Searches
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {searches.map((pokemon, index) => (
        <div
          key={pokemon}
          className={`px-2 py-2 rounded cursor-pointer transition-colors capitalize ${
            index === selectedIndex
              ? 'bg-blue-100 text-blue-900'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelect(pokemon)}
        >
          {pokemon}
        </div>
      ))}
    </div>
  )
}
