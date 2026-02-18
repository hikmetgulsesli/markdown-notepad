import { useState, useEffect, useCallback, useRef } from 'react'

export interface Document {
  id: string
  name: string
  content: string
  updatedAt: number
}

export type DocumentsStatus = 'saved' | 'saving' | 'error'

interface UseDocumentsOptions {
  debounceMs?: number
}

interface UseDocumentsResult {
  documents: Document[]
  activeDocumentId: string | null
  activeDocument: Document | null
  setActiveDocument: (id: string) => void
  createDocument: (name?: string) => string
  renameDocument: (id: string, newName: string) => void
  deleteDocument: (id: string) => void
  updateDocumentContent: (content: string) => void
  status: DocumentsStatus
  error: string | null
}

const STORAGE_KEY = 'markdown-notepad-documents'
const DEFAULT_DOCUMENT_NAME = 'Untitled Document'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function createNewDocument(name: string = DEFAULT_DOCUMENT_NAME): Document {
  return {
    id: generateId(),
    name,
    content: '',
    updatedAt: Date.now(),
  }
}

/**
 * Custom hook for managing multiple markdown documents in localStorage.
 * 
 * @param options - Configuration options
 * @returns Object containing documents, active document, and CRUD operations
 */
export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsResult {
  const { debounceMs = 400 } = options
  
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [status, setStatus] = useState<DocumentsStatus>('saved')
  const [error, setError] = useState<string | null>(null)
  
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // Load documents from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Document[]
        setDocuments(parsed)
        // Set the most recently updated document as active
        if (parsed.length > 0) {
          const mostRecent = parsed.reduce((latest, doc) => 
            doc.updatedAt > latest.updatedAt ? doc : latest
          )
          setActiveDocumentId(mostRecent.id)
        }
      } else {
        // Create initial document if none exist
        const initialDoc = createNewDocument('Welcome')
        setDocuments([initialDoc])
        setActiveDocumentId(initialDoc.id)
      }
    } catch (err) {
      console.warn('Failed to load documents:', err)
      setError('Failed to load documents')
      // Create a fallback document
      const fallbackDoc = createNewDocument('Welcome')
      setDocuments([fallbackDoc])
      setActiveDocumentId(fallbackDoc.id)
    }
  }, [])
  
  // Save documents to localStorage with debounce
  const saveDocuments = useCallback((docs: Document[]) => {
    setStatus('saving')
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
        setStatus('saved')
        setError(null)
      } catch (err) {
        if (err instanceof Error && err.name === 'QuotaExceededError') {
          setError('Storage is full. Please delete some documents.')
        } else {
          setError('Failed to save documents')
        }
        setStatus('error')
        console.error('Failed to save documents:', err)
      }
    }, debounceMs)
  }, [debounceMs])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])
  
  const setActiveDocument = useCallback((id: string) => {
    setActiveDocumentId(id)
  }, [])
  
  const createDocument = useCallback((name?: string): string => {
    const newDoc = createNewDocument(name)
    setDocuments(prev => {
      const updated = [newDoc, ...prev]
      saveDocuments(updated)
      return updated
    })
    setActiveDocumentId(newDoc.id)
    return newDoc.id
  }, [saveDocuments])
  
  const renameDocument = useCallback((id: string, newName: string) => {
    if (!newName.trim()) return
    
    setDocuments(prev => {
      const updated = prev.map(doc =>
        doc.id === id ? { ...doc, name: newName.trim(), updatedAt: Date.now() } : doc
      )
      saveDocuments(updated)
      return updated
    })
  }, [saveDocuments])
  
  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => {
      const updated = prev.filter(doc => doc.id !== id)
      // If we deleted the last document, create a new one
      if (updated.length === 0) {
        const newDoc = createNewDocument()
        updated.push(newDoc)
        setActiveDocumentId(newDoc.id)
      } else if (activeDocumentId === id) {
        // Switch to another document if we deleted the active one
        setActiveDocumentId(updated[0].id)
      }
      saveDocuments(updated)
      return updated
    })
  }, [activeDocumentId, saveDocuments])
  
  const updateDocumentContent = useCallback((content: string) => {
    if (!activeDocumentId) return
    
    setDocuments(prev => {
      const updated = prev.map(doc =>
        doc.id === activeDocumentId ? { ...doc, content, updatedAt: Date.now() } : doc
      )
      saveDocuments(updated)
      return updated
    })
  }, [activeDocumentId, saveDocuments])
  
  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || null
  
  return {
    documents,
    activeDocumentId,
    activeDocument,
    setActiveDocument,
    createDocument,
    renameDocument,
    deleteDocument,
    updateDocumentContent,
    status,
    error,
  }
}
