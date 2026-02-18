import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDocuments } from '../hooks/useDocuments'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create initial document when localStorage is empty', () => {
    const { result } = renderHook(() => useDocuments())

    expect(result.current.documents).toHaveLength(1)
    expect(result.current.documents[0].name).toBe('Welcome')
    expect(result.current.activeDocumentId).toBe(result.current.documents[0].id)
    expect(result.current.activeDocument).toBeDefined()
  })

  it('should load documents from localStorage', () => {
    const storedDocs = [
      { id: '1', name: 'Doc 1', content: 'Content 1', updatedAt: Date.now() },
      { id: '2', name: 'Doc 2', content: 'Content 2', updatedAt: Date.now() - 1000 },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedDocs))

    const { result } = renderHook(() => useDocuments())

    expect(result.current.documents).toHaveLength(2)
    expect(result.current.documents[0].name).toBe('Doc 1')
    expect(result.current.documents[1].name).toBe('Doc 2')
    // Most recent document should be active
    expect(result.current.activeDocumentId).toBe('1')
  })

  it('should handle localStorage parse errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json')

    const { result } = renderHook(() => useDocuments())

    expect(result.current.documents).toHaveLength(1)
    expect(result.current.error).toBe('Failed to load documents')
  })

  it('should create a new document', () => {
    const { result } = renderHook(() => useDocuments())

    act(() => {
      result.current.createDocument('New Document')
    })

    expect(result.current.documents).toHaveLength(2)
    expect(result.current.documents[0].name).toBe('New Document')
    expect(result.current.activeDocumentId).toBe(result.current.documents[0].id)
  })

  it('should create document with default name when no name provided', () => {
    const { result } = renderHook(() => useDocuments())

    act(() => {
      result.current.createDocument()
    })

    expect(result.current.documents[0].name).toBe('Untitled Document')
  })

  it('should switch between documents', () => {
    const { result } = renderHook(() => useDocuments())

    act(() => {
      result.current.createDocument('Second Doc')
    })

    const firstId = result.current.documents[1].id
    const secondId = result.current.documents[0].id

    expect(result.current.activeDocumentId).toBe(secondId)

    act(() => {
      result.current.setActiveDocument(firstId)
    })

    expect(result.current.activeDocumentId).toBe(firstId)
    expect(result.current.activeDocument?.name).toBe('Welcome')
  })

  it('should rename a document', () => {
    const { result } = renderHook(() => useDocuments())
    const docId = result.current.documents[0].id

    act(() => {
      result.current.renameDocument(docId, 'Renamed Document')
    })

    expect(result.current.documents[0].name).toBe('Renamed Document')
  })

  it('should not rename with empty name', () => {
    const { result } = renderHook(() => useDocuments())
    const originalName = result.current.documents[0].name
    const docId = result.current.documents[0].id

    act(() => {
      result.current.renameDocument(docId, '   ')
    })

    expect(result.current.documents[0].name).toBe(originalName)
  })

  it('should trim whitespace from renamed document', () => {
    const { result } = renderHook(() => useDocuments())
    const docId = result.current.documents[0].id

    act(() => {
      result.current.renameDocument(docId, '  New Name  ')
    })

    expect(result.current.documents[0].name).toBe('New Name')
  })

  it('should delete a document', () => {
    const { result } = renderHook(() => useDocuments())

    act(() => {
      result.current.createDocument('Second Doc')
    })

    const secondId = result.current.documents[0].id

    expect(result.current.documents).toHaveLength(2)

    act(() => {
      result.current.deleteDocument(secondId)
    })

    expect(result.current.documents).toHaveLength(1)
    expect(result.current.documents[0].name).toBe('Welcome')
  })

  it('should create new document when last document is deleted', () => {
    const { result } = renderHook(() => useDocuments())
    const docId = result.current.documents[0].id

    act(() => {
      result.current.deleteDocument(docId)
    })

    expect(result.current.documents).toHaveLength(1)
    expect(result.current.documents[0].name).toBe('Untitled Document')
  })

  it('should switch to another document when active document is deleted', () => {
    const { result } = renderHook(() => useDocuments())

    act(() => {
      result.current.createDocument('Second Doc')
    })

    const firstId = result.current.documents[1].id
    const secondId = result.current.documents[0].id

    // Second doc is active by default
    expect(result.current.activeDocumentId).toBe(secondId)

    act(() => {
      result.current.deleteDocument(secondId)
    })

    // Should switch to first doc
    expect(result.current.activeDocumentId).toBe(firstId)
  })

  it('should update document content', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { result } = renderHook(() => useDocuments({ debounceMs: 100 }))

    act(() => {
      result.current.updateDocumentContent('New content')
    })

    expect(result.current.status).toBe('saving')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.status).toBe('saved')
    })

    expect(result.current.documents[0].content).toBe('New content')
  })

  it('should save documents to localStorage with debounce', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { result } = renderHook(() => useDocuments({ debounceMs: 400 }))

    act(() => {
      result.current.updateDocumentContent('Content 1')
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Should not have saved yet
    expect(localStorageMock.setItem).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(200)
    })

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
    expect(savedData[0].content).toBe('Content 1')
  })

  it('should handle storage quota exceeded error', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    localStorageMock.setItem.mockImplementation(() => {
      const error = new Error('Quota exceeded')
      error.name = 'QuotaExceededError'
      throw error
    })

    const { result } = renderHook(() => useDocuments({ debounceMs: 100 }))

    act(() => {
      result.current.updateDocumentContent('Content')
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.status).toBe('error')
      expect(result.current.error).toBe('Storage is full. Please delete some documents.')
    })
  })

  it('should update updatedAt timestamp when content changes', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { result } = renderHook(() => useDocuments({ debounceMs: 100 }))
    
    const originalTimestamp = result.current.documents[0].updatedAt

    // Wait a bit to ensure timestamp changes
    act(() => {
      vi.advanceTimersByTime(10)
    })

    act(() => {
      result.current.updateDocumentContent('New content')
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(result.current.documents[0].updatedAt).toBeGreaterThan(originalTimestamp)
    })
  })

  it('should update updatedAt timestamp when renamed', () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { result } = renderHook(() => useDocuments())
    const originalTimestamp = result.current.documents[0].updatedAt
    const docId = result.current.documents[0].id

    // Small delay to ensure timestamp difference
    act(() => {
      vi.advanceTimersByTime(10)
    })

    act(() => {
      result.current.renameDocument(docId, 'New Name')
    })

    expect(result.current.documents[0].updatedAt).toBeGreaterThan(originalTimestamp)
  })
})
