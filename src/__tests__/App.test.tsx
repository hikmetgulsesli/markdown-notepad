import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Markdown Notepad')).toBeInTheDocument()
  })

  it('renders the editor layout', () => {
    render(<App />)
    expect(screen.getByTestId('editor-layout')).toBeInTheDocument()
    expect(screen.getByTestId('editor-pane')).toBeInTheDocument()
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument()
  })

  it('renders editor and preview pane headers', () => {
    render(<App />)
    const paneTitles = screen.getAllByText('Editor')
    expect(paneTitles.length).toBeGreaterThan(0)
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<App />)
    const themeToggle = screen.getByRole('button', { name: /switch to/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders markdown editor textarea', () => {
    render(<App />)
    const editor = screen.getByRole('textbox', { name: /markdown editor/i })
    expect(editor).toBeInTheDocument()
  })

  it('renders resizable divider', () => {
    render(<App />)
    const divider = screen.getByTestId('divider')
    expect(divider).toBeInTheDocument()
    expect(divider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders save status indicator', () => {
    render(<App />)
    const statusIndicator = screen.getByTestId('save-status-indicator')
    expect(statusIndicator).toBeInTheDocument()
  })

  it('renders formatting toolbar', () => {
    render(<App />)
    const toolbar = screen.getByTestId('formatting-toolbar')
    expect(toolbar).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-bold')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-italic')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-heading')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-link')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-code')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-list')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-ordered-list')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-quote')).toBeInTheDocument()
  })

  it('loads saved content from localStorage on mount', () => {
    const savedContent = '# Previously saved markdown'
    localStorage.setItem('markdown-notepad-content', savedContent)
    
    render(<App />)
    
    const editor = screen.getByRole('textbox', { name: /markdown editor/i })
    expect(editor).toHaveValue(savedContent)
  })

  it('handles localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw error
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied')
    })
    
    // Should not throw
    expect(() => render(<App />)).not.toThrow()
    
    // App should still render
    expect(screen.getByText('Markdown Notepad')).toBeInTheDocument()
  })
})
