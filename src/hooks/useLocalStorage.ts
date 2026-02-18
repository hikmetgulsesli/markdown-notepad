import { useState, useEffect, useCallback, useRef } from 'react'

export type SaveStatus = 'saved' | 'saving' | 'error'

interface UseLocalStorageOptions {
  key: string
  debounceMs?: number
}

interface UseLocalStorageResult {
  value: string
  setValue: (value: string) => void
  saveStatus: SaveStatus
  error: string | null
  clear: () => void
}

/**
 * Custom hook for persisting data to localStorage with debounced saves.
 * 
 * @param options - Configuration options
 * @returns Object containing value, setter, save status, error, and clear function
 */
export function useLocalStorage({
  key,
  debounceMs = 400,
}: UseLocalStorageOptions): UseLocalStorageResult {
  const [value, setValueState] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [error, setError] = useState<string | null>(null)
  
  // Use a ref to track the timeout for debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValueState(stored)
      }
    } catch (err) {
      // Handle localStorage access errors (e.g., private browsing mode)
      console.warn('Failed to load from localStorage:', err)
      setError('Failed to load saved content')
    }
  }, [key])
  
  // Set value with debounced save
  const setValue = useCallback((newValue: string) => {
    setValueState(newValue)
    setSaveStatus('saving')
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    // Set new timeout for debounced save
    debounceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, newValue)
        setSaveStatus('saved')
        setError(null)
      } catch (err) {
        // Handle quota exceeded or other storage errors
        if (err instanceof Error && err.name === 'QuotaExceededError') {
          setError('Storage is full. Please clear some space.')
        } else {
          setError('Failed to save content')
        }
        setSaveStatus('error')
        console.error('Failed to save to localStorage:', err)
      }
    }, debounceMs)
  }, [debounceMs, key])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])
  
  // Clear function to remove from localStorage
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setValueState('')
      setSaveStatus('saved')
      setError(null)
    } catch (err) {
      setError('Failed to clear storage')
      console.error('Failed to clear localStorage:', err)
    }
  }, [key])
  
  return {
    value,
    setValue,
    saveStatus,
    error,
    clear,
  }
}
