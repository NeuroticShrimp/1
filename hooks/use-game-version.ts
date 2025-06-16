"use client"

import { useState, useEffect } from "react"

export function useGameVersion() {
  const [gameVersion, setGameVersion] = useState("red-blue")

  // Load from localStorage if available
  useEffect(() => {
    const savedVersion = localStorage.getItem("gameVersion")
    if (savedVersion) {
      setGameVersion(savedVersion)
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("gameVersion", gameVersion)
  }, [gameVersion])

  return { gameVersion, setGameVersion }
}
