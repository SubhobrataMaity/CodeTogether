import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage, default to light
    const savedTheme = localStorage.getItem("theme")
    const initialTheme = savedTheme || "light"
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Save theme to localStorage
    localStorage.setItem("theme", theme)

    // Apply theme to document
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return { theme, setTheme, toggleTheme, mounted }
} 