import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'markdown-notepad-theme'

interface UseThemeOptions {
  defaultTheme?: Theme
  storageKey?: string
}

export function useTheme(options: UseThemeOptions = {}) {
  const { defaultTheme = 'light', storageKey = STORAGE_KEY } = options
  
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored === 'light' || stored === 'dark') {
          return stored
        }
      } catch {
        // localStorage not available
      }
      
      // Check system preference
      try {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark'
        }
      } catch {
        // matchMedia not available
      }
    }
    return defaultTheme
  })
  
  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  
  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, theme)
      } catch {
        // localStorage not available
      }
    }
  }, [theme, storageKey])
  
  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let mediaQuery: MediaQueryList | null = null
    
    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    } catch {
      // matchMedia not available
      return
    }
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if user hasn't explicitly set a preference
      try {
        const stored = localStorage.getItem(storageKey)
        if (!stored) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      } catch {
        // localStorage not available, still apply system preference
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery?.removeEventListener('change', handleChange)
  }, [storageKey])
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])
  
  const setLightTheme = useCallback(() => {
    setTheme('light')
  }, [])
  
  const setDarkTheme = useCallback(() => {
    setTheme('dark')
  }, [])
  
  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  }
}
