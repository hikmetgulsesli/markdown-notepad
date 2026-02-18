import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentManager } from '../components/DocumentManager'
import type { Document, DocumentsStatus } from '../hooks/useDocuments'

describe('DocumentManager', () => {
  const mockDocuments: Document[] = [
    { id: '1', name: 'Document 1', content: 'Content 1', updatedAt: Date.now() },
    { id: '2', name: 'Document 2', content: 'Content 2', updatedAt: Date.now() - 1000 },
  ]

  const defaultProps = {
    documents: mockDocuments,
    activeDocumentId: '1',
    status: 'saved' as DocumentsStatus,
    error: null,
    onSelectDocument: vi.fn(),
    onCreateDocument: vi.fn(),
    onRenameDocument: vi.fn(),
    onDeleteDocument: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render trigger button with active document name', () => {
    render(<DocumentManager {...defaultProps} />)
    
    expect(screen.getByLabelText('Manage documents')).toHaveTextContent('Document 1')
  })

  it('should show "Select Document" when no active document', () => {
    render(<DocumentManager {...defaultProps} activeDocumentId={null} />)
    
    expect(screen.getByLabelText('Manage documents')).toHaveTextContent('Select Document')
  })

  it('should open dropdown when trigger is clicked', async () => {
    render(<DocumentManager {...defaultProps} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getAllByText('Document 1')).toHaveLength(2) // trigger + list item
    expect(screen.getByText('Document 2')).toBeInTheDocument()
  })

  it('should call onSelectDocument when a document is clicked', async () => {
    const onSelectDocument = vi.fn()
    render(<DocumentManager {...defaultProps} onSelectDocument={onSelectDocument} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    await userEvent.click(screen.getByText('Document 2'))
    
    expect(onSelectDocument).toHaveBeenCalledWith('2')
  })

  it('should call onCreateDocument when new button is clicked', async () => {
    const onCreateDocument = vi.fn()
    render(<DocumentManager {...defaultProps} onCreateDocument={onCreateDocument} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    await userEvent.click(screen.getByLabelText('Create new document'))
    
    expect(onCreateDocument).toHaveBeenCalledTimes(1)
  })

  it('should show empty state when no documents', async () => {
    render(<DocumentManager {...defaultProps} documents={[]} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    expect(screen.getByText('No documents yet')).toBeInTheDocument()
  })

  it('should show document count in status', async () => {
    render(<DocumentManager {...defaultProps} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    expect(screen.getByText('2 documents')).toBeInTheDocument()
  })

  it('should show singular "document" when only one document', async () => {
    render(<DocumentManager {...defaultProps} documents={[mockDocuments[0]]} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    expect(screen.getByText('1 document')).toBeInTheDocument()
  })

  it('should show saving status', async () => {
    render(<DocumentManager {...defaultProps} status="saving" />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('should show error message', async () => {
    render(<DocumentManager {...defaultProps} status="error" error="Storage full" />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    expect(screen.getByText('Storage full')).toBeInTheDocument()
  })

  it('should call onDeleteDocument when delete button is clicked', async () => {
    const onDeleteDocument = vi.fn()
    render(<DocumentManager {...defaultProps} onDeleteDocument={onDeleteDocument} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    // Get all delete buttons and click the first one
    const deleteButtons = screen.getAllByLabelText(/Delete/)
    await userEvent.click(deleteButtons[0])
    
    expect(onDeleteDocument).toHaveBeenCalledWith('1')
  })

  it('should enter rename mode when rename button is clicked', async () => {
    render(<DocumentManager {...defaultProps} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    const renameButton = screen.getAllByLabelText(/Rename/)[0]
    await userEvent.click(renameButton)
    
    const input = screen.getByLabelText('Rename document')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Document 1')
  })

  it('should call onRenameDocument when rename is submitted', async () => {
    const onRenameDocument = vi.fn()
    render(<DocumentManager {...defaultProps} onRenameDocument={onRenameDocument} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    const renameButton = screen.getAllByLabelText(/Rename/)[0]
    await userEvent.click(renameButton)
    
    const input = screen.getByLabelText('Rename document')
    await userEvent.clear(input)
    await userEvent.type(input, 'New Name')
    await userEvent.keyboard('{Enter}')
    
    expect(onRenameDocument).toHaveBeenCalledWith('1', 'New Name')
  })

  it('should cancel rename on Escape key', async () => {
    render(<DocumentManager {...defaultProps} />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    const renameButton = screen.getAllByLabelText(/Rename/)[0]
    await userEvent.click(renameButton)
    
    const input = screen.getByLabelText('Rename document')
    await userEvent.type(input, 'Some Name')
    await userEvent.keyboard('{Escape}')
    
    // Input should be gone
    expect(screen.queryByLabelText('Rename document')).not.toBeInTheDocument()
    // Original name should be visible - use getAllByText since it appears in trigger and list
    expect(screen.getAllByText('Document 1')).toHaveLength(2)
  })

  it('should close dropdown when clicking outside', async () => {
    render(
      <div>
        <DocumentManager {...defaultProps} />
        <div data-testid="outside">Outside</div>
      </div>
    )
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    
    await userEvent.click(screen.getByTestId('outside'))
    
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  it('should mark active document with aria-selected', async () => {
    render(<DocumentManager {...defaultProps} activeDocumentId="2" />)
    
    await userEvent.click(screen.getByLabelText('Manage documents'))
    
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('should have proper ARIA attributes on trigger', () => {
    render(<DocumentManager {...defaultProps} />)
    
    const trigger = screen.getByLabelText('Manage documents')
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('should update aria-expanded when dropdown opens', async () => {
    render(<DocumentManager {...defaultProps} />)
    
    const trigger = screen.getByLabelText('Manage documents')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    
    await userEvent.click(trigger)
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('should create new document on Ctrl+N keyboard shortcut', () => {
    const onCreateDocument = vi.fn()
    render(<DocumentManager {...defaultProps} onCreateDocument={onCreateDocument} />)
    
    fireEvent.keyDown(document, { key: 'n', ctrlKey: true })
    
    expect(onCreateDocument).toHaveBeenCalledTimes(1)
  })

  it('should create new document on Cmd+N keyboard shortcut (Mac)', () => {
    const onCreateDocument = vi.fn()
    render(<DocumentManager {...defaultProps} onCreateDocument={onCreateDocument} />)
    
    fireEvent.keyDown(document, { key: 'n', metaKey: true })
    
    expect(onCreateDocument).toHaveBeenCalledTimes(1)
  })
})
