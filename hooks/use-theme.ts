"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/store/store"

type Theme = "light" | "dark"

export function useTheme() {
  const { theme, setTheme } = useStore()
  const [mounted, setMounted] = useState(false)

  // Update the theme when it changes
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)

    // Save theme preference to localStorage
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true)

    const savedTheme = localStorage.getItem("theme") as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }
  }, [setTheme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return { theme, toggleTheme, mounted }
}

