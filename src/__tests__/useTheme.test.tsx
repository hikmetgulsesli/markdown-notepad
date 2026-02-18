import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../hooks/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    
    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('defaults to light theme when no preference stored', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(result.current.isDark).toBe(false)
  })

  it('reads theme from localStorage on init', () => {
    localStorage.setItem('markdown-notepad-theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(result.current.isDark).toBe(true)
  })

  it('detects system dark mode preference on first visit', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(result.current.isDark).toBe(true)
  })

  it('toggles theme from light to dark', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.theme).toBe('dark')
    expect(result.current.isDark).toBe(true)
    expect(localStorage.getItem('markdown-notepad-theme')).toBe('dark')
  })

  it('toggles theme from dark to light', () => {
    localStorage.setItem('markdown-notepad-theme', 'dark')
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.theme).toBe('light')
    expect(result.current.isDark).toBe(false)
    expect(localStorage.getItem('markdown-notepad-theme')).toBe('light')
  })

  it('sets light theme explicitly', () => {
    localStorage.setItem('markdown-notepad-theme', 'dark')
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setLightTheme()
    })
    
    expect(result.current.theme).toBe('light')
    expect(result.current.isDark).toBe(false)
  })

  it('sets dark theme explicitly', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setDarkTheme()
    })
    
    expect(result.current.theme).toBe('dark')
    expect(result.current.isDark).toBe(true)
  })

  it('adds dark class to document when theme is dark', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setDarkTheme()
    })
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class from document when theme is light', () => {
    localStorage.setItem('markdown-notepad-theme', 'dark')
    const { result } = renderHook(() => useTheme())
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    
    act(() => {
      result.current.setLightTheme()
    })
    
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('uses custom storage key', () => {
    const { result } = renderHook(() => useTheme({ storageKey: 'custom-theme-key' }))
    
    act(() => {
      result.current.setDarkTheme()
    })
    
    expect(localStorage.getItem('custom-theme-key')).toBe('dark')
    expect(localStorage.getItem('markdown-notepad-theme')).toBeNull()
  })

  it('uses default theme option when no stored preference', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    const { result } = renderHook(() => useTheme({ defaultTheme: 'dark' }))
    expect(result.current.theme).toBe('dark')
  })

  it('does not respond to system preference changes when preference is stored', () => {
    localStorage.setItem('markdown-notepad-theme', 'light')
    
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') {
            changeHandler = handler as (e: MediaQueryListEvent) => void
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    
    // Simulate system preference change to dark
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent)
      }
    })
    
    // Should remain light because user has stored preference
    expect(result.current.theme).toBe('light')
  })
})
