import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  const storageKey = 'test-key'
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  it('initializes with empty string when no stored value', () => {
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey })
    )
    
    expect(result.current.value).toBe('')
    expect(result.current.saveStatus).toBe('saved')
    expect(result.current.error).toBeNull()
  })
  
  it('loads existing value from localStorage on mount', () => {
    const storedValue = 'previously saved content'
    localStorage.setItem(storageKey, storedValue)
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey })
    )
    
    expect(result.current.value).toBe(storedValue)
  })
  
  it('saves value to localStorage after debounce', async () => {
    vi.useFakeTimers()
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey, debounceMs: 400 })
    )
    
    const newValue = 'new content'
    
    act(() => {
      result.current.setValue(newValue)
    })
    
    // Status should be 'saving' immediately after change
    expect(result.current.saveStatus).toBe('saving')
    
    // Fast-forward past debounce
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    expect(result.current.saveStatus).toBe('saved')
    expect(localStorage.getItem(storageKey)).toBe(newValue)
    
    vi.useRealTimers()
  })
  
  it('debounces multiple rapid changes', async () => {
    vi.useFakeTimers()
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey, debounceMs: 400 })
    )
    
    act(() => {
      result.current.setValue('first')
    })
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    act(() => {
      result.current.setValue('second')
    })
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    // Should still be saving because we reset the timer
    expect(result.current.saveStatus).toBe('saving')
    expect(localStorage.getItem(storageKey)).toBeNull()
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    expect(result.current.saveStatus).toBe('saved')
    expect(localStorage.getItem(storageKey)).toBe('second')
    
    vi.useRealTimers()
  })
  
  it('handles localStorage quota exceeded error', async () => {
    vi.useFakeTimers()
    
    // Mock localStorage.setItem to throw QuotaExceededError
    const quotaError = new Error('Quota exceeded')
    quotaError.name = 'QuotaExceededError'
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw quotaError
    })
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey, debounceMs: 100 })
    )
    
    act(() => {
      result.current.setValue('some content')
    })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current.saveStatus).toBe('error')
    expect(result.current.error).toBe('Storage is full. Please clear some space.')
    
    // Restore mock
    vi.restoreAllMocks()
    vi.useRealTimers()
  })
  
  it('handles generic localStorage errors', async () => {
    vi.useFakeTimers()
    
    // Mock localStorage.setItem to throw generic error
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Unknown error')
    })
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey, debounceMs: 100 })
    )
    
    act(() => {
      result.current.setValue('some content')
    })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current.saveStatus).toBe('error')
    expect(result.current.error).toBe('Failed to save content')
    
    // Restore mock
    vi.restoreAllMocks()
    vi.useRealTimers()
  })
  
  it('handles localStorage access errors on load', () => {
    // Mock localStorage.getItem to throw error
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied')
    })
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey })
    )
    
    expect(result.current.value).toBe('')
    expect(result.current.error).toBe('Failed to load saved content')
    
    // Restore mock
    vi.restoreAllMocks()
  })
  
  it('clears stored value when clear is called', () => {
    localStorage.setItem(storageKey, 'content to clear')
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey })
    )
    
    act(() => {
      result.current.clear()
    })
    
    expect(result.current.value).toBe('')
    expect(result.current.saveStatus).toBe('saved')
    expect(localStorage.getItem(storageKey)).toBeNull()
  })
  
  it('uses custom debounce time', async () => {
    vi.useFakeTimers()
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey, debounceMs: 800 })
    )
    
    act(() => {
      result.current.setValue('content')
    })
    
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    // Should still be saving because debounce is 800ms
    expect(result.current.saveStatus).toBe('saving')
    expect(localStorage.getItem(storageKey)).toBeNull()
    
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    expect(result.current.saveStatus).toBe('saved')
    expect(localStorage.getItem(storageKey)).toBe('content')
    
    vi.useRealTimers()
  })
  
  it('clears timeout on unmount', () => {
    vi.useFakeTimers()
    
    const { result, unmount } = renderHook(() =>
      useLocalStorage({ key: storageKey, debounceMs: 1000 })
    )
    
    act(() => {
      result.current.setValue('content')
    })
    
    // Unmount before debounce completes
    unmount()
    
    // Advance timers - should not throw or save
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(localStorage.getItem(storageKey)).toBeNull()
    
    vi.useRealTimers()
  })
  
  it('handles clear errors gracefully', () => {
    localStorage.setItem(storageKey, 'content')
    
    // Mock localStorage.removeItem to throw error
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Access denied')
    })
    
    const { result } = renderHook(() =>
      useLocalStorage({ key: storageKey })
    )
    
    act(() => {
      result.current.clear()
    })
    
    expect(result.current.error).toBe('Failed to clear storage')
    
    // Restore mock
    vi.restoreAllMocks()
  })
})
