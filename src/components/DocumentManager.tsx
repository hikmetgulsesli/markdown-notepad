import { useState, useRef, useEffect, useCallback } from 'react'
import { FileText, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react'
import type { Document, DocumentsStatus } from '../hooks/useDocuments'
import './DocumentManager.css'

interface DocumentManagerProps {
  documents: Document[]
  activeDocumentId: string | null
  status: DocumentsStatus
  error: string | null
  onSelectDocument: (id: string) => void
  onCreateDocument: () => void
  onRenameDocument: (id: string, newName: string) => void
  onDeleteDocument: (id: string) => void
}

/**
 * Document manager component for creating, selecting, renaming, and deleting documents.
 * Displays as a dropdown with a list of all documents.
 */
export function DocumentManager({
  documents,
  activeDocumentId,
  status,
  error,
  onSelectDocument,
  onCreateDocument,
  onRenameDocument,
  onDeleteDocument,
}: DocumentManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const activeDocument = documents.find(doc => doc.id === activeDocumentId)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setEditingId(null)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  // Focus input when editing starts
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingId])
  
  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl/Cmd + N for new document
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        onCreateDocument()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCreateDocument])
  
  const handleToggle = () => {
    setIsOpen(!isOpen)
    setEditingId(null)
  }
  
  const handleSelect = (id: string) => {
    onSelectDocument(id)
    setIsOpen(false)
  }
  
  const handleCreate = () => {
    onCreateDocument()
    setIsOpen(false)
  }
  
  const handleStartRename = useCallback((e: React.MouseEvent, doc: Document) => {
    e.stopPropagation()
    setEditingId(doc.id)
    setEditingName(doc.name)
  }, [])
  
  const handleRenameSubmit = useCallback(() => {
    if (editingId && editingName.trim()) {
      onRenameDocument(editingId, editingName.trim())
    }
    setEditingId(null)
  }, [editingId, editingName, onRenameDocument])
  
  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit()
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }, [handleRenameSubmit])
  
  const handleDelete = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onDeleteDocument(id)
  }, [onDeleteDocument])
  
  const getStatusText = () => {
    if (error) return error
    if (status === 'saving') return 'Saving...'
    return `${documents.length} document${documents.length !== 1 ? 's' : ''}`
  }
  
  return (
    <div className="document-manager" ref={dropdownRef}>
      <button
        className="document-manager-trigger"
        onClick={handleToggle}
        aria-label="Manage documents"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <FileText className="document-manager-trigger-icon" aria-hidden="true" />
        <span className="document-manager-trigger-text">
          {activeDocument?.name || 'Select Document'}
        </span>
        <ChevronDown 
          className={`document-manager-trigger-chevron ${isOpen ? 'open' : ''}`} 
          aria-hidden="true" 
        />
      </button>
      
      {isOpen && (
        <div 
          className="document-manager-dropdown"
          role="listbox"
          aria-label="Documents"
        >
          <div className="document-manager-header">
            <h3 className="document-manager-title">Documents</h3>
            <button
              className="document-manager-new-btn"
              onClick={handleCreate}
              aria-label="Create new document"
            >
              <Plus aria-hidden="true" />
              New
            </button>
          </div>
          
          <div className="document-manager-list">
            {documents.length === 0 ? (
              <div className="document-manager-empty">
                No documents yet
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`document-manager-item ${doc.id === activeDocumentId ? 'active' : ''}`}
                  onClick={() => handleSelect(doc.id)}
                  role="option"
                  aria-selected={doc.id === activeDocumentId}
                >
                  <FileText className="document-manager-item-icon" aria-hidden="true" />
                  
                  {editingId === doc.id ? (
                    <input
                      ref={inputRef}
                      className="document-manager-item-input"
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={handleRenameKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Rename document"
                    />
                  ) : (
                    <span className="document-manager-item-name">{doc.name}</span>
                  )}
                  
                  <div className="document-manager-item-actions">
                    <button
                      className="document-manager-item-btn"
                      onClick={(e) => handleStartRename(e, doc)}
                      aria-label={`Rename ${doc.name}`}
                      title="Rename"
                    >
                      <Pencil aria-hidden="true" />
                    </button>
                    <button
                      className="document-manager-item-btn"
                      onClick={(e) => handleDelete(e, doc.id)}
                      aria-label={`Delete ${doc.name}`}
                      title="Delete"
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className={`document-manager-status ${status === 'saving' ? 'document-manager-status-saving' : ''} ${error ? 'document-manager-status-error' : ''}`}>
            {getStatusText()}
          </div>
        </div>
      )}
    </div>
  )
}
